"""Tests de tools/calcul_marge.py. Lancer : py -m unittest tests/test_calcul_marge.py

Toutes les données ci-dessous sont des EXEMPLES FICTIFS (pas de vrais relevés AliExpress).
"""
import sys
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import calcul_marge as cm  # noqa: E402

GRILLE_EXEMPLE = """# Grille d'exemple (données fictives, exemple seulement)

Texte avant le tableau.

| N° | Modèle | Réf. | Prix officiel (€) | Lien AliExpress | Prix AliExpress (€) | Livraison (€) | Expédié depuis | Délai (jours) | Note | Ventes | Stock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Exemple A (fictif) | EX-001 | 69,99 | https://example.invalid/a | 30,00 | 5.00 | Espagne | 7-12 | 4,8 | 1 200 | 250 |
| 2 | Exemple B (fictif) | EX-002 | 49,99 | https://example.invalid/b | 20,50 | 0 | Chine | 20 | 4,9 | 5 000 | 900 |
| 3 | Exemple C non relevé (fictif) | EX-003 | 39,99 | | | | | | | | |

Texte après le tableau.
"""


class TestCalculMarge(unittest.TestCase):
    def setUp(self):
        self.p = cm.parametres()
        self.resultats = cm.analyser(cm.lire_grille(GRILLE_EXEMPLE), self.p)

    def test_parsing_virgules_et_lignes_vides(self):
        self.assertEqual(cm.nombre("30,00"), Decimal("30.00"))
        self.assertEqual(cm.nombre("5.00"), Decimal("5.00"))
        self.assertEqual(cm.nombre("1 234,56 €"), Decimal("1234.56"))
        self.assertEqual(cm.nombre("4,8/5"), Decimal("4.8"))
        self.assertEqual(cm.nombre("7-12", pire_cas=True), Decimal("12"))
        self.assertIsNone(cm.nombre(""))
        # la ligne 3 sans prix AliExpress est ignorée
        self.assertEqual([r["n"] for r in self.resultats], ["1", "2"])

    def test_ligne_retenue(self):
        r = self.resultats[0]
        self.assertEqual(r["verdict"], "RETENU", r["raisons"])
        self.assertEqual(r["cout"], Decimal("35.00"))
        # 61,90 x (1 - 0,015 - 0,123 - 0,05) - 0,25 - 35 = 15,0128 ; 60,90 donnerait 14,20
        self.assertEqual(r["conseille"], Decimal("61.90"))
        self.assertEqual(cm.fmt_eur(r["marge"]), "15,01")
        self.assertLess(cm.marge_nette(Decimal("60.90"), r["cout"], self.p), Decimal("15"))
        # plancher 10 € : 55,90 donne 10,14 ; 54,90 donnerait 9,33
        self.assertEqual(r["plancher"], Decimal("55.90"))
        self.assertEqual(r["remarques"], [])  # 61,90 < 69,99

    def test_ligne_ecartee_chine(self):
        r = self.resultats[1]
        self.assertEqual(r["verdict"], "ÉCARTÉ")
        self.assertTrue(any("Chine" in x and "hors UE" in x for x in r["raisons"]))
        self.assertTrue(any("délai 20" in x for x in r["raisons"]))

    def test_sortie_fichier(self):
        with tempfile.TemporaryDirectory() as d:
            grille, sortie = Path(d) / "g.md", Path(d) / "s.md"
            grille.write_text(GRILLE_EXEMPLE, encoding="utf-8")
            self.assertEqual(cm.main([str(grille), "--sortie", str(sortie)]), 0)
            texte = sortie.read_text(encoding="utf-8")
            self.assertIn("| 1 | Exemple A (fictif) | 35,00 | 61,90 | 15,01 | 55,90 | 69,99 | RETENU |", texte)
            self.assertIn("À VÉRIFIER sur stripe.com/fr/pricing", texte)


if __name__ == "__main__":
    unittest.main()
