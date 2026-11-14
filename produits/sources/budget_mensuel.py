#!/usr/bin/env python3
"""Produit n°1 : tableur « Budget mensuel » (Excel et Google Sheets), en français.

Usage : python produits/sources/budget_mensuel.py [chemin_sortie.xlsx]
Construit le fichier vendu. Fonctions limitées à celles qui marchent dans Excel 2010+, Google Sheets et LibreOffice
(SUMIFS, INDEX, MATCH, EDATE, IFERROR, DATE) : aucune fonction récente, aucune macro.
"""
import datetime as dt
import pathlib
import sys

from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference, Series
from openpyxl.comments import Comment
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation

SORTIE = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "produits/fichiers/budget-mensuel.xlsx")
LIGNES = 1500  # lignes de transactions prêtes à remplir

# ---------- Style ----------
POLICE = "Arial"
VERT = "1F6F5B"        # couleur principale
VERT_CLAIR = "E6F2EE"
SAISIE = "FFF4D6"      # cellules à remplir
GRIS = "6B7280"
ROUGE = "B42318"
F = lambda **k: Font(name=POLICE, **k)
fond = lambda c: PatternFill("solid", fgColor=c)
fin = Side(style="thin", color="D9DEE3")
BORD = Border(bottom=fin)
EUROS = '#,##0.00 "€";-#,##0.00 "€";"-"'
POURC = '0%;-0%;"-"'
DATE_FR = "dd/mm/yyyy"

MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
TYPES = ["Revenu", "Dépense fixe", "Dépense variable", "Épargne"]

# Catégories et budgets mensuels d'exemple (modifiables par l'acheteur ; montants purement illustratifs)
CATEGORIES = [
    ("Salaire", "Revenu", 1650), ("Aides (CAF, APL...)", "Revenu", 0), ("Autres revenus", "Revenu", 0),
    ("Loyer", "Dépense fixe", 620), ("Électricité et gaz", "Dépense fixe", 55), ("Internet et téléphone", "Dépense fixe", 35),
    ("Assurances", "Dépense fixe", 25), ("Transports (abonnement)", "Dépense fixe", 40), ("Abonnements", "Dépense fixe", 20),
    ("Crédit", "Dépense fixe", 0),
    ("Courses", "Dépense variable", 250), ("Restaurants et sorties", "Dépense variable", 80), ("Carburant", "Dépense variable", 0),
    ("Santé", "Dépense variable", 20), ("Shopping", "Dépense variable", 60), ("Cadeaux", "Dépense variable", 20),
    ("Imprévus", "Dépense variable", 50),
    ("Épargne de précaution", "Épargne", 150), ("Projets", "Épargne", 50),
]
NB_CAT_MAX = 40  # emplacements de catégories (les vides sont ignorés)

# Transactions d'exemple, à supprimer par l'acheteur
EXEMPLES = [
    (1, "Salaire de novembre", "Salaire", 1650), (2, "Loyer", "Loyer", 620), (3, "Forfait mobile + box", "Internet et téléphone", 35),
    (4, "Supermarché", "Courses", 62.40), (6, "Pass Navigo / Tisséo", "Transports (abonnement)", 40), (8, "Cinéma", "Restaurants et sorties", 11.50),
    (9, "Supermarché", "Courses", 48.15), (12, "Assurance habitation", "Assurances", 25), (14, "Pharmacie", "Santé", 8.90),
    (15, "Virement livret A", "Épargne de précaution", 150), (18, "Restaurant", "Restaurants et sorties", 23), (20, "Supermarché", "Courses", 71.30),
]

wb = Workbook()

# =====================================================================
# 1. Commencer ici
# =====================================================================
g = wb.active
g.title = "Commencer ici"
g.sheet_view.showGridLines = False
g.column_dimensions["A"].width = 3
g.column_dimensions["B"].width = 100
g["B2"] = "Budget mensuel"
g["B2"].font = F(size=24, bold=True, color=VERT)
g["B3"] = "Vos comptes du mois, sans prise de tête : vous notez vos dépenses, le tableur fait le reste."
g["B3"].font = F(size=12, color=GRIS)
texte = [
    ("Démarrer en 4 étapes", True),
    ("1. Onglet « Réglages » : adaptez les catégories et indiquez votre budget prévu pour chacune (cellules jaunes).", False),
    ("2. Onglet « Transactions » : supprimez les lignes d'exemple, puis notez chaque revenu ou dépense (date, libellé, catégorie, montant).", False),
    ("3. Onglet « Tableau de bord » : choisissez le mois et l'année en haut. Tout se calcule : reste à vivre, dépassements, taux d'épargne.", False),
    ("4. Onglet « Année » : vos 12 mois côte à côte, avec un graphique revenus et dépenses.", False),
    ("", False),
    ("Les règles à connaître", True),
    ("Cellules jaunes : à remplir. Toutes les autres se calculent toutes seules : ne les effacez pas.", False),
    ("Montants toujours positifs : c'est la catégorie qui dit s'il s'agit d'un revenu, d'une dépense ou d'une épargne.", False),
    ("Une catégorie ajoutée dans « Réglages » apparaît automatiquement dans la liste déroulante des transactions.", False),
    ("", False),
    ("Google Sheets", True),
    ("Fichier > Importer > Importer un fichier, choisissez ce fichier, puis « Remplacer la feuille de calcul ». Tout fonctionne de la même façon.", False),
    ("", False),
    ("Une question ?", True),
    ("Écrivez-nous à l'adresse indiquée dans l'e-mail de votre commande. Ce fichier est pour votre usage personnel : merci de ne pas le revendre ni le partager.", False),
]
for i, (t, titre) in enumerate(texte, start=5):
    c = g.cell(row=i, column=2, value=t)
    c.font = F(size=13 if titre else 11, bold=titre, color=VERT if titre else "111827")
    c.alignment = Alignment(wrap_text=True, vertical="top")
g["B22"] = "Légende"
g["B22"].font = F(size=13, bold=True, color=VERT)
g["B23"] = "Cellule à remplir"
g["B23"].fill = fond(SAISIE)
g["B23"].font = F(size=11)
g["B24"] = "Cellule calculée (ne pas modifier)"
g["B24"].font = F(size=11, color=GRIS)

# =====================================================================
# 2. Réglages
# =====================================================================
r = wb.create_sheet("Réglages")
r.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", (3, 30, 20, 18, 4, 14, 18)):
    r.column_dimensions[col].width = w
r["B2"] = "Réglages"
r["B2"].font = F(size=18, bold=True, color=VERT)
r["B3"] = "Vos catégories et votre budget prévu par mois. Ajoutez des lignes en dessous si besoin (jusqu'à la ligne 45)."
r["B3"].font = F(size=10, color=GRIS)
for col, t in zip("BCD", ("Catégorie", "Type", "Budget mensuel")):
    c = r[f"{col}5"]
    c.value = t
    c.font = F(bold=True, color="FFFFFF")
    c.fill = fond(VERT)
DEB_CAT, FIN_CAT = 6, 6 + NB_CAT_MAX - 1
for i in range(NB_CAT_MAX):
    ligne = DEB_CAT + i
    nom, typ, budget = CATEGORIES[i] if i < len(CATEGORIES) else (None, None, None)
    for col, v in zip("BCD", (nom, typ, budget)):
        c = r[f"{col}{ligne}"]
        c.value = v
        c.fill = fond(SAISIE)
        c.font = F(size=11)
        c.border = BORD
    r[f"D{ligne}"].number_format = EUROS
r["D6"].comment = Comment("Montants d'exemple : remplacez-les par les vôtres.", "Budget mensuel")
# Listes cachées (types et mois) pour les menus déroulants
r["F5"] = "Types"
r["G5"] = "Mois"
for c in (r["F5"], r["G5"]):
    c.font = F(bold=True, color=GRIS)
for i, t in enumerate(TYPES):
    r[f"F{6 + i}"] = t
for i, m in enumerate(MOIS):
    r[f"G{6 + i}"] = m
for col in "FG":
    for ligne in range(5, 18):
        r[f"{col}{ligne}"].font = F(size=9, color=GRIS)
r.column_dimensions["F"].hidden = True
r.column_dimensions["G"].hidden = True
wb.defined_names["Categories"] = DefinedName("Categories", attr_text=f"'Réglages'!$B${DEB_CAT}:$B${FIN_CAT}")
wb.defined_names["Types"] = DefinedName("Types", attr_text="'Réglages'!$F$6:$F$9")
wb.defined_names["ListeMois"] = DefinedName("ListeMois", attr_text="'Réglages'!$G$6:$G$17")
dv_type = DataValidation(type="list", formula1="=Types", allow_blank=True, showErrorMessage=True,
                         errorTitle="Type inconnu", error="Choisissez : Revenu, Dépense fixe, Dépense variable ou Épargne.")
r.add_data_validation(dv_type)
dv_type.add(f"C{DEB_CAT}:C{FIN_CAT}")
dv_montant = DataValidation(type="decimal", operator="greaterThanOrEqual", formula1="0", allow_blank=True,
                            showErrorMessage=True, errorTitle="Montant", error="Indiquez un montant positif.")
r.add_data_validation(dv_montant)
dv_montant.add(f"D{DEB_CAT}:D{FIN_CAT}")
r.freeze_panes = "B6"

# =====================================================================
# 3. Transactions
# =====================================================================
t = wb.create_sheet("Transactions")
t.sheet_view.showGridLines = False
for col, w in zip("ABCDEFG", (3, 14, 34, 28, 14, 18, 4)):
    t.column_dimensions[col].width = w
t["B2"] = "Transactions"
t["B2"].font = F(size=18, bold=True, color=VERT)
t["B3"] = "Une ligne par revenu ou dépense. Les 12 lignes d'exemple (novembre 2026) sont à supprimer : sélectionnez-les et appuyez sur Suppr."
t["B3"].font = F(size=10, color=GRIS)
for col, txt in zip("BCDEF", ("Date", "Libellé", "Catégorie", "Montant", "Type (auto)")):
    c = t[f"{col}5"]
    c.value = txt
    c.font = F(bold=True, color="FFFFFF")
    c.fill = fond(VERT)
DEB_T, FIN_T = 6, 6 + LIGNES - 1
for i in range(LIGNES):
    ligne = DEB_T + i
    for col in "BCDE":
        c = t[f"{col}{ligne}"]
        c.fill = fond(SAISIE)
        c.font = F(size=11)
        c.border = BORD
    t[f"B{ligne}"].number_format = DATE_FR
    t[f"E{ligne}"].number_format = EUROS
    f = t[f"F{ligne}"]
    f.value = f'=IF(D{ligne}="","",IFERROR(INDEX(\'Réglages\'!$C${DEB_CAT}:$C${FIN_CAT},MATCH(D{ligne},Categories,0)),"Catégorie inconnue"))'
    f.font = F(size=10, color=GRIS)
    f.border = BORD
for i, (jour, lib, cat, mt) in enumerate(EXEMPLES):
    ligne = DEB_T + i
    t[f"B{ligne}"] = dt.date(2026, 11, jour)
    t[f"C{ligne}"] = lib
    t[f"D{ligne}"] = cat
    t[f"E{ligne}"] = mt
dv_cat = DataValidation(type="list", formula1="=Categories", allow_blank=True, showErrorMessage=True,
                        errorTitle="Catégorie", error="Choisissez une catégorie de l'onglet Réglages (ou ajoutez-la là-bas).")
t.add_data_validation(dv_cat)
dv_cat.add(f"D{DEB_T}:D{FIN_T}")
dv_date = DataValidation(type="date", operator="greaterThan", formula1="36526", allow_blank=True,
                         showErrorMessage=True, errorTitle="Date", error="Saisissez une date, par exemple 05/11/2026.")
t.add_data_validation(dv_date)
dv_date.add(f"B{DEB_T}:B{FIN_T}")
dv_mt = DataValidation(type="decimal", operator="greaterThanOrEqual", formula1="0", allow_blank=True,
                       showErrorMessage=True, errorTitle="Montant", error="Montant positif : la catégorie indique le sens.")
t.add_data_validation(dv_mt)
dv_mt.add(f"E{DEB_T}:E{FIN_T}")
t.conditional_formatting.add(f"F{DEB_T}:F{FIN_T}", FormulaRule(formula=[f'F{DEB_T}="Catégorie inconnue"'], font=Font(name=POLICE, color=ROUGE, bold=True)))
t.freeze_panes = "B6"

RNG_D = f"Transactions!$B${DEB_T}:$B${FIN_T}"
RNG_C = f"Transactions!$D${DEB_T}:$D${FIN_T}"
RNG_M = f"Transactions!$E${DEB_T}:$E${FIN_T}"
RNG_T = f"Transactions!$F${DEB_T}:$F${FIN_T}"

# =====================================================================
# 4. Tableau de bord
# =====================================================================
d = wb.create_sheet("Tableau de bord")
d.sheet_view.showGridLines = False
for col, w in zip("ABCDEFGH", (3, 30, 20, 16, 16, 16, 12, 3)):
    d.column_dimensions[col].width = w
d["B2"] = "Tableau de bord"
d["B2"].font = F(size=18, bold=True, color=VERT)
d["B4"] = "Mois"
d["C4"] = "novembre"
d["B5"] = "Année"
d["C5"] = 2026
for c in ("B4", "B5"):
    d[c].font = F(bold=True)
for c in ("C4", "C5"):
    d[c].fill = fond(SAISIE)
    d[c].font = F(size=12, bold=True)
dv_mois = DataValidation(type="list", formula1="=ListeMois", allow_blank=False)
d.add_data_validation(dv_mois)
dv_mois.add("C4")
dv_an = DataValidation(type="whole", operator="between", formula1="2000", formula2="2100", allow_blank=False,
                       showErrorMessage=True, errorTitle="Année", error="Saisissez une année, par exemple 2026.")
d.add_data_validation(dv_an)
dv_an.add("C5")
# Début et fin du mois choisi (cellules techniques, discrètes)
d["E4"] = "Du"
d["F4"] = "=DATE($C$5,MATCH($C$4,ListeMois,0),1)"
d["E5"] = "Au (exclu)"
d["F5"] = "=EDATE($F$4,1)"
for c in ("E4", "E5"):
    d[c].font = F(size=9, color=GRIS)
for c in ("F4", "F5"):
    d[c].number_format = DATE_FR
    d[c].font = F(size=9, color=GRIS)

somme_type = lambda typ: f'SUMIFS({RNG_M},{RNG_T},"{typ}",{RNG_D},">="&$F$4,{RNG_D},"<"&$F$5)'
CARTES = [  # libellé, formule, format
    ("Revenus du mois", "=" + somme_type("Revenu"), EUROS),
    ("Dépenses du mois", "=" + somme_type("Dépense fixe") + "+" + somme_type("Dépense variable"), EUROS),
    ("Épargne du mois", "=" + somme_type("Épargne"), EUROS),
    ("Reste à vivre", "=C8-C9-C10", EUROS),
    ("Taux d'épargne", "=IF(C8=0,0,C10/C8)", POURC),
]
for i, (lib, formule, fmt) in enumerate(CARTES):
    ligne = 8 + i
    d[f"B{ligne}"] = lib
    d[f"B{ligne}"].font = F(size=12)
    c = d[f"C{ligne}"]
    c.value = formule
    c.number_format = fmt
    c.font = F(size=14, bold=True, color=VERT)
    for col in "BC":
        d[f"{col}{ligne}"].fill = fond(VERT_CLAIR)
        d[f"{col}{ligne}"].border = Border(bottom=Side(style="thin", color="FFFFFF"))
d.conditional_formatting.add("C11", FormulaRule(formula=["C11<0"], font=Font(name=POLICE, size=14, bold=True, color=ROUGE)))
d["D11"] = '=IF(C11<0,"Attention : le mois est dans le rouge","")'
d["D11"].font = F(size=10, bold=True, color=ROUGE)

# Détail par catégorie (suit l'ordre de Réglages)
L0 = 15
for col, txt in zip("BCDEFG", ("Catégorie", "Type", "Prévu", "Réel", "Écart", "Utilisé")):
    c = d[f"{col}{L0}"]
    c.value = txt
    c.font = F(bold=True, color="FFFFFF")
    c.fill = fond(VERT)
d[f"B{L0 - 1}"] = "Détail par catégorie"
d[f"B{L0 - 1}"].font = F(size=13, bold=True, color=VERT)
for i in range(NB_CAT_MAX):
    ligne = L0 + 1 + i
    src = DEB_CAT + i
    d[f"B{ligne}"] = f"=IF('Réglages'!$B${src}=\"\",\"\",'Réglages'!$B${src})"
    d[f"C{ligne}"] = f"=IF(B{ligne}=\"\",\"\",'Réglages'!$C${src})"
    d[f"D{ligne}"] = f"=IF(B{ligne}=\"\",\"\",'Réglages'!$D${src})"
    d[f"E{ligne}"] = f'=IF(B{ligne}="","",SUMIFS({RNG_M},{RNG_C},B{ligne},{RNG_D},">="&$F$4,{RNG_D},"<"&$F$5))'
    d[f"F{ligne}"] = f'=IF(B{ligne}="","",IF(C{ligne}="Revenu",E{ligne}-D{ligne},D{ligne}-E{ligne}))'
    d[f"G{ligne}"] = f'=IF(OR(B{ligne}="",N(D{ligne})=0),"",E{ligne}/D{ligne})'
    for col in "BCDEFG":
        d[f"{col}{ligne}"].font = F(size=11)
        d[f"{col}{ligne}"].border = BORD
    for col in "DEF":
        d[f"{col}{ligne}"].number_format = EUROS
    d[f"G{ligne}"].number_format = POURC
    d[f"C{ligne}"].font = F(size=10, color=GRIS)
FIN_D = L0 + NB_CAT_MAX
# Dépassement d'une dépense : écart négatif en rouge
d.conditional_formatting.add(f"F{L0 + 1}:G{FIN_D}", FormulaRule(
    formula=[f'AND($C{L0 + 1}<>"Revenu",$C{L0 + 1}<>"",N($F{L0 + 1})<0)'], font=Font(name=POLICE, bold=True, color=ROUGE)))
d[f"B{FIN_D + 2}"] = "Écart : pour une dépense, ce qu'il reste à dépenser (en rouge si dépassé) ; pour un revenu, ce qui a été reçu en plus du prévu."
d[f"B{FIN_D + 2}"].font = F(size=9, color=GRIS)
d.freeze_panes = "A7"

# Graphique : prévu et réel des dépenses (catégories visibles en haut du détail)
ch = BarChart()
ch.type = "bar"
ch.style = 10
ch.title = "Dépenses : prévu et réel"
ch.y_axis.title = "€"
lignes_dep = [i for i, c in enumerate(CATEGORIES) if c[1] in ("Dépense fixe", "Dépense variable")]
a, b = L0 + 1 + lignes_dep[0], L0 + 1 + lignes_dep[-1]
ch.set_categories(Reference(d, min_col=2, min_row=a, max_row=b))
for col, nom in ((4, "Prévu"), (5, "Réel")):
    s = Series(Reference(d, min_col=col, min_row=a, max_row=b), title=nom)
    ch.series.append(s)
ch.height, ch.width = 11, 16
ch.roundedCorners = False
ch.legend.position = "b"
ch.legend.overlay = False
ch.title.overlay = False
ch.x_axis.delete = False
ch.y_axis.delete = False
d.add_chart(ch, "I4")

# =====================================================================
# 5. Année
# =====================================================================
y = wb.create_sheet("Année")
y.sheet_view.showGridLines = False
for col, w in zip("ABCDEFGH", (3, 16, 16, 16, 18, 16, 16, 3)):
    y.column_dimensions[col].width = w
y["B2"] = "Année"
y["B2"].font = F(size=18, bold=True, color=VERT)
y["B3"] = "=\"Année \"&'Tableau de bord'!$C$5&\" (changez l'année dans le Tableau de bord)\""
y["B3"].font = F(size=10, color=GRIS)
for col, txt in zip("BCDEFG", ("Mois", "Revenus", "Dépenses fixes", "Dépenses variables", "Épargne", "Solde")):
    c = y[f"{col}5"]
    c.value = txt
    c.font = F(bold=True, color="FFFFFF")
    c.fill = fond(VERT)
sm = lambda typ, ligne: f'SUMIFS({RNG_M},{RNG_T},"{typ}",{RNG_D},">="&DATE(\'Tableau de bord\'!$C$5,{ligne - 5},1),{RNG_D},"<"&EDATE(DATE(\'Tableau de bord\'!$C$5,{ligne - 5},1),1))'
for k, m in enumerate(MOIS):
    ligne = 6 + k
    y[f"B{ligne}"] = m
    y[f"C{ligne}"] = "=" + sm("Revenu", ligne)
    y[f"D{ligne}"] = "=" + sm("Dépense fixe", ligne)
    y[f"E{ligne}"] = "=" + sm("Dépense variable", ligne)
    y[f"F{ligne}"] = "=" + sm("Épargne", ligne)
    y[f"G{ligne}"] = f"=C{ligne}-D{ligne}-E{ligne}-F{ligne}"
    for col in "BCDEFG":
        y[f"{col}{ligne}"].font = F(size=11)
        y[f"{col}{ligne}"].border = BORD
    for col in "CDEFG":
        y[f"{col}{ligne}"].number_format = EUROS
y["B18"] = "Total"
for col in "CDEFG":
    y[f"{col}18"] = f"=SUM({col}6:{col}17)"
    y[f"{col}18"].number_format = EUROS
for col in "BCDEFG":
    y[f"{col}18"].font = F(bold=True)
    y[f"{col}18"].fill = fond(VERT_CLAIR)
y.conditional_formatting.add("G6:G18", FormulaRule(formula=["G6<0"], font=Font(name=POLICE, bold=True, color=ROUGE)))
ch2 = BarChart()
ch2.type = "col"
ch2.style = 10
ch2.title = "Revenus et dépenses par mois"
ch2.add_data(Reference(y, min_col=3, min_row=5, max_row=17), titles_from_data=True)
dep = Series(Reference(y, min_col=4, min_row=6, max_row=17), title="Dépenses fixes")
var = Series(Reference(y, min_col=5, min_row=6, max_row=17), title="Dépenses variables")
ch2.series.append(dep)
ch2.series.append(var)
ch2.set_categories(Reference(y, min_col=2, min_row=6, max_row=17))
ch2.height, ch2.width = 10, 22
ch2.roundedCorners = False
ch2.legend.position = "b"
ch2.legend.overlay = False
ch2.title.overlay = False
ch2.x_axis.delete = False
ch2.y_axis.delete = False
y.add_chart(ch2, "B21")

# Ordre des onglets et onglet actif
wb.move_sheet("Tableau de bord", offset=-2)
wb.active = 0
for ws in wb.worksheets:
    ws.sheet_properties.tabColor = VERT if ws.title in ("Commencer ici", "Tableau de bord") else "9CA3AF"
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
wb.properties.title = "Budget mensuel"
wb.properties.creator = "Budget mensuel"
SORTIE.parent.mkdir(parents=True, exist_ok=True)
wb.save(SORTIE)
print(f"Écrit : {SORTIE}")
