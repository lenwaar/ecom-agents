"""Calcul de marge et de prix conseillé pour la grille AliExpress (Robotime ROKR).

Usage :
    py tools/calcul_marge.py <grille.md> [--sortie resultat.md] [--frais-prudents] [--versement-liberatoire]

Lit le tableau de la grille remplie par l'humain (en-têtes exacts ci-dessous), contrôle
les seuils fournisseur, calcule le prix de vente conseillé TTC (franchise en base de TVA,
art. 293 B du CGI) et la marge nette réelle. Bibliothèque standard uniquement.

Formule (par commande d'un article, en dropshipping) :
    coût fournisseur = prix AliExpress + livraison vers la France
    marge nette = P - coût fournisseur - (STRIPE_TAUX * P + STRIPE_FIXE)
                  - COTISATIONS * P - PROVISION_RETOURS * P
                  - LIVRAISON_CLIENT_EN_PLUS - EMBALLAGE - ECO_PARTICIPATION
"""
import argparse
import re
import sys
import unicodedata
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

# ---------------------------------------------------------------------------
# CONSTANTES (chacune avec sa source)
# ---------------------------------------------------------------------------

# Frais Stripe, carte standard de l'EEE : 1,5 % + 0,25 €.
# Source : docs/site-technique.md (« tarif Stripe consulté le 2026-11-12 »).
# À VÉRIFIER sur stripe.com/fr/pricing (non revérifié par ce script ; les cartes hors EEE
# ou professionnelles coûtent plus cher).
STRIPE_TAUX = Decimal("0.015")
STRIPE_FIXE = Decimal("0.25")
STRIPE_A_VERIFIER = True

# Hypothèse prudente de knowledge/prix-et-marges.md (« 3 % + 0,30 € par commande,
# À VÉRIFIER »), utilisée avec l'option --frais-prudents.
STRIPE_TAUX_PRUDENT = Decimal("0.03")
STRIPE_FIXE_PRUDENT = Decimal("0.30")

# Cotisations micro-entreprise, vente de marchandises : 12,3 % du chiffre d'affaires
# (13,3 % avec versement libératoire, option --versement-liberatoire).
# Source : knowledge/prix-et-marges.md, knowledge/memo.md, leçon 4 de docs/retours-experience.md.
# Taux à confirmer par l'URSSAF ou un expert-comptable.
COTISATIONS = Decimal("0.123")
COTISATIONS_VL = Decimal("0.133")

# Provision retours/SAV : 5 % du prix de vente.
# Source : knowledge/memo.md (« SAV (5 %) »), knowledge/prix-et-marges.md.
PROVISION_RETOURS = Decimal("0.05")

# Livraison au client en plus du port fournisseur : 0 €.
# En dropshipping, le fournisseur expédie directement au client : la colonne
# « Livraison (€) » de la grille EST l'envoi au client. Hypothèse prudente : livraison
# offerte (le prix de vente couvre seul ce port). knowledge/politiques.md : « Frais de
# livraison : À VÉRIFIER » ; si l'humain décide de facturer la livraison, la marge augmente.
LIVRAISON_CLIENT_EN_PLUS = Decimal("0.00")

# Emballage : 0 € (dropshipping, colis préparé par le fournisseur ;
# knowledge/decisions.md, « Modèle d'approvisionnement »).
EMBALLAGE = Decimal("0.00")

# Éco-participation REP jouets : montant inconnu, compté 0 € en attendant.
# Source : knowledge/prix-et-marges.md (« À VÉRIFIER, barème de l'éco-organisme ») ;
# leçon 4 de docs/retours-experience.md : elle doit entrer dans la marge.
ECO_PARTICIPATION = Decimal("0.00")
ECO_A_VERIFIER = True

# Droits et frais d'import : 0 € car seules les offres expédiées depuis l'UE sont retenues
# (knowledge/decisions.md, synchro n°16). Une offre hors UE est ÉCARTÉE, sans calcul de droits.

# Seuils (knowledge/decisions.md « Modèle d'approvisionnement », knowledge/contraintes.md).
MARGE_OBJECTIF = Decimal("15")
MARGE_PLANCHER = Decimal("10")
DELAI_MAX_JOURS = 14
NOTE_MIN = Decimal("4.5")
STOCK_MIN = 100

# Prix psychologique : terminaison en ,90.
TERMINAISON = Decimal("0.90")

EN_TETES = ["N°", "Modèle", "Réf.", "Prix officiel (€)", "Lien AliExpress", "Prix AliExpress (€)",
            "Livraison (€)", "Expédié depuis", "Délai (jours)", "Note", "Ventes", "Stock"]

# Pays de l'UE (27) : noms français, anglais et codes ISO, comparés sans accents ni casse.
PAYS_UE = {
    "allemagne", "germany", "de", "autriche", "austria", "at", "belgique", "belgium", "be",
    "bulgarie", "bulgaria", "bg", "chypre", "cyprus", "cy", "croatie", "croatia", "hr",
    "danemark", "denmark", "dk", "espagne", "spain", "es", "estonie", "estonia", "ee",
    "finlande", "finland", "fi", "france", "fr", "grece", "greece", "gr", "el",
    "hongrie", "hungary", "hu", "irlande", "ireland", "ie", "italie", "italy", "it",
    "lettonie", "latvia", "lv", "lituanie", "lithuania", "lt", "luxembourg", "lu",
    "malte", "malta", "mt", "pays-bas", "pays bas", "netherlands", "nl", "pologne", "poland", "pl",
    "portugal", "pt", "republique tcheque", "tchequie", "czech republic", "czechia", "cz",
    "roumanie", "romania", "ro", "slovaquie", "slovakia", "sk", "slovenie", "slovenia", "si",
    "suede", "sweden", "se",
}


# ---------------------------------------------------------------------------
# Lecture
# ---------------------------------------------------------------------------

def sans_accents(texte):
    t = unicodedata.normalize("NFKD", texte)
    return "".join(c for c in t if not unicodedata.combining(c)).lower().strip()


def nombre(texte, pire_cas=False):
    """« 1 234,56 € », « 12.5 », « 4,8/5 » (4,8), « 200+ » -> Decimal ou None.
    Avec pire_cas=True (délai « 7-12 »), renvoie la plus grande valeur."""
    if texte is None:
        return None
    t = texte.replace(" ", " ").replace(" ", " ").strip()
    trouves = re.findall(r"\d[\d ]*(?:[.,]\d+)?", t)
    if not trouves:
        return None
    valeurs = []
    for brut in trouves:
        brut = brut.replace(" ", "").replace(",", ".")
        try:
            valeurs.append(Decimal(brut))
        except Exception:
            return None
    return max(valeurs) if pire_cas else valeurs[0]


def cellules(ligne):
    l = ligne.strip()
    if l.startswith("|"):
        l = l[1:]
    if l.endswith("|"):
        l = l[:-1]
    return [c.strip() for c in l.split("|")]


def lire_grille(texte):
    """Renvoie la liste des lignes (dict en-tête -> cellule) du tableau aux en-têtes attendus."""
    lignes = texte.splitlines()
    attendus = [h.lower() for h in EN_TETES]
    for i, ligne in enumerate(lignes):
        if not ligne.strip().startswith("|"):
            continue
        if [c.lower() for c in cellules(ligne)] != attendus:
            continue
        produits = []
        for suite in lignes[i + 2:]:  # i+1 = ligne de séparation
            if not suite.strip().startswith("|"):
                break
            cs = cellules(suite)
            cs += [""] * (len(EN_TETES) - len(cs))
            produits.append(dict(zip(EN_TETES, cs)))
        return produits
    raise ValueError("Tableau introuvable : en-têtes attendus | " + " | ".join(EN_TETES) + " |")


# ---------------------------------------------------------------------------
# Calcul
# ---------------------------------------------------------------------------

def parametres(frais_prudents=False, versement_liberatoire=False):
    return {
        "stripe_taux": STRIPE_TAUX_PRUDENT if frais_prudents else STRIPE_TAUX,
        "stripe_fixe": STRIPE_FIXE_PRUDENT if frais_prudents else STRIPE_FIXE,
        "cotisations": COTISATIONS_VL if versement_liberatoire else COTISATIONS,
    }


def marge_nette(prix, cout, p):
    frais_stripe = p["stripe_taux"] * prix + p["stripe_fixe"]
    return (prix - cout - frais_stripe - p["cotisations"] * prix - PROVISION_RETOURS * prix
            - LIVRAISON_CLIENT_EN_PLUS - EMBALLAGE - ECO_PARTICIPATION)


def prix_psychologique(cout, marge_visee, p):
    """Plus petit prix en ,90 dont la marge nette atteint marge_visee."""
    taux = 1 - p["stripe_taux"] - p["cotisations"] - PROVISION_RETOURS
    fixe = cout + p["stripe_fixe"] + LIVRAISON_CLIENT_EN_PLUS + EMBALLAGE + ECO_PARTICIPATION
    exact = (marge_visee + fixe) / taux
    euros = int(exact - TERMINAISON) if exact > TERMINAISON else 0
    prix = Decimal(euros) + TERMINAISON
    while marge_nette(prix, cout, p) < marge_visee:
        prix += 1
    while prix - 1 >= TERMINAISON and marge_nette(prix - 1, cout, p) >= marge_visee:
        prix -= 1
    return prix


def controler(prod):
    """Renvoie la liste des raisons d'écartement (vide = seuils respectés)."""
    raisons = []
    pays = prod.get("Expédié depuis", "").strip()
    if not pays:
        raisons.append("pays d'expédition non renseigné (À VÉRIFIER)")
    elif sans_accents(pays) not in PAYS_UE:
        raisons.append(f"expédié depuis {pays} (hors UE)")
    delai = nombre(prod.get("Délai (jours)"), pire_cas=True)
    if delai is None:
        raisons.append("délai non renseigné (À VÉRIFIER)")
    elif delai > DELAI_MAX_JOURS:
        raisons.append(f"délai {fmt_nb(delai)} j > {DELAI_MAX_JOURS} j")
    note = nombre(prod.get("Note"))
    if note is None:
        raisons.append("note non renseignée (À VÉRIFIER)")
    elif note < NOTE_MIN:
        raisons.append(f"note {fmt_nb(note)} < 4,5")
    stock = nombre(prod.get("Stock"))
    if stock is None:
        raisons.append("stock non renseigné (À VÉRIFIER)")
    elif stock < STOCK_MIN:
        raisons.append(f"stock {fmt_nb(stock)} < {STOCK_MIN}")
    return raisons


def analyser(produits, p):
    resultats = []
    for prod in produits:
        prix_ali = nombre(prod.get("Prix AliExpress (€)"))
        if prix_ali is None:
            continue  # ligne non remplie
        livraison = nombre(prod.get("Livraison (€)"))
        raisons = controler(prod)
        if livraison is None:
            livraison = Decimal("0")
            raisons.append("livraison non renseignée, comptée 0 € (À VÉRIFIER)")
        cout = prix_ali + livraison
        conseille = prix_psychologique(cout, MARGE_OBJECTIF, p)
        plancher = prix_psychologique(cout, MARGE_PLANCHER, p)
        officiel = nombre(prod.get("Prix officiel (€)"))
        remarques = []
        if officiel is None:
            remarques.append("prix officiel non renseigné")
        elif conseille > officiel:
            if plancher > officiel:
                remarques.append("prix conseillé et plancher au-dessus du prix officiel Robotime")
            else:
                remarques.append("prix conseillé au-dessus du prix officiel Robotime")
        resultats.append({
            "n": prod.get("N°", ""), "modele": prod.get("Modèle", ""), "cout": cout,
            "conseille": conseille, "marge": marge_nette(conseille, cout, p),
            "plancher": plancher, "officiel": officiel,
            "verdict": "ÉCARTÉ" if raisons else "RETENU", "raisons": raisons, "remarques": remarques,
        })
    return resultats


# ---------------------------------------------------------------------------
# Sortie
# ---------------------------------------------------------------------------

def fmt_eur(v):
    if v is None:
        return "À VÉRIFIER"
    return f"{v.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)}".replace(".", ",")


def fmt_nb(v):
    t = format(v.normalize(), "f") if v == v.to_integral() else str(v)
    return t.replace(".", ",")


def rendu(resultats, p, source):
    lignes = [f"# Calcul de marge : {source}", ""]
    lignes.append(
        f"Hypothèses : Stripe {fmt_nb(p['stripe_taux'] * 100)} % + {fmt_eur(p['stripe_fixe'])} € ; "
        f"cotisations {fmt_nb(p['cotisations'] * 100)} % ; provision retours/SAV "
        f"{fmt_nb(PROVISION_RETOURS * 100)} % ; livraison offerte au client (port fournisseur compris "
        f"dans le coût) ; emballage {fmt_eur(EMBALLAGE)} € ; éco-participation {fmt_eur(ECO_PARTICIPATION)} €. "
        "Prix TTC, TVA non applicable, art. 293 B du CGI.")
    lignes.append("")
    avert = []
    if STRIPE_A_VERIFIER:
        avert.append("AVERTISSEMENT : frais Stripe À VÉRIFIER sur stripe.com/fr/pricing.")
    if ECO_A_VERIFIER:
        avert.append("AVERTISSEMENT : éco-participation REP jouets À VÉRIFIER (comptée 0 € : marge surestimée d'autant).")
    lignes += avert + ([""] if avert else [])
    lignes.append("| N° | Modèle | Coût fournisseur (€) | Prix conseillé (€) | Marge à ce prix (€) "
                  "| Prix plancher 10 € (€) | Prix officiel (€) | Verdict | Raison / remarque |")
    lignes.append("|---|---|---|---|---|---|---|---|---|")
    for r in resultats:
        texte = "; ".join(r["raisons"] + r["remarques"]) or "-"
        lignes.append(
            f"| {r['n']} | {r['modele']} | {fmt_eur(r['cout'])} | {fmt_eur(r['conseille'])} | "
            f"{fmt_eur(r['marge'])} | {fmt_eur(r['plancher'])} | {fmt_eur(r['officiel'])} | "
            f"{r['verdict']} | {texte} |")
    if not resultats:
        lignes.append("| - | Aucune ligne avec un prix AliExpress | | | | | | | |")
    retenus = sum(1 for r in resultats if r["verdict"] == "RETENU")
    lignes += ["", f"{retenus} retenu(s), {len(resultats) - retenus} écarté(s) sur {len(resultats)} ligne(s) remplie(s).",
               "Prix proposés : l'humain valide avant toute mise en vente."]
    return "\n".join(lignes) + "\n"


def main(argv=None):
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="Marge et prix conseillé depuis la grille AliExpress.")
    ap.add_argument("grille", help="fichier Markdown contenant la grille")
    ap.add_argument("--sortie", help="écrit aussi le tableau dans ce fichier Markdown")
    ap.add_argument("--frais-prudents", action="store_true",
                    help="frais de paiement 3 %% + 0,30 € (hypothèse de knowledge/prix-et-marges.md)")
    ap.add_argument("--versement-liberatoire", action="store_true", help="cotisations 13,3 %% au lieu de 12,3 %%")
    args = ap.parse_args(argv)
    texte = Path(args.grille).read_text(encoding="utf-8")
    try:
        produits = lire_grille(texte)
    except ValueError as e:
        print(f"ERREUR : {e}", file=sys.stderr)
        return 1
    p = parametres(args.frais_prudents, args.versement_liberatoire)
    sortie = rendu(analyser(produits, p), p, Path(args.grille).name)
    print(sortie)
    if args.sortie:
        Path(args.sortie).write_text(sortie, encoding="utf-8")
        print(f"Écrit dans {args.sortie}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
