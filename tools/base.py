#!/usr/bin/env python3
"""Base de données de l'entreprise (SQLite, aucune dépendance, 0 €).

Usage (depuis la racine du dépôt) :
  python tools/base.py init                 crée donnees/entreprise.db à partir de donnees/schema.sql
  python tools/base.py statut               affiche l'état de la semaine (« company status --monday »)
  python tools/base.py attente              liste ce qui attend une décision de l'humain
  python tools/base.py valider <id> oui|non enregistre la décision de l'humain
  python tools/base.py sauvegarde           copie datée dans donnees/sauvegardes/ (fiche A14)
  python tools/base.py exemple              crée donnees/exemple.db avec des données FICTIVES pour tester
Option : --base <chemin> pour viser une autre base.
"""
import datetime as dt, pathlib, shutil, sqlite3, sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
# Console Windows (cp1252) : forcer l'UTF-8 pour afficher « € » et les accents
for _flux in (sys.stdout, sys.stderr):
    try: _flux.reconfigure(encoding='utf-8')
    except (AttributeError, ValueError): pass
# Lancé depuis un worktree de Claude Code (.claude/worktrees/<nom>/) : utiliser la base du dépôt principal,
# sinon chaque worktree aurait sa propre base vide et les validations seraient perdues.
_parties = RACINE.parts
DEPOT = pathlib.Path(*_parties[:_parties.index('.claude')]) if '.claude' in _parties and 'worktrees' in _parties else RACINE
BASE = DEPOT / 'donnees/entreprise.db'
SCHEMA = RACINE / 'donnees/schema.sql'

def connecter(chemin=BASE, creer=False):
    chemin = pathlib.Path(chemin)
    if not chemin.exists() and not creer:
        sys.exit(f'Base absente : {chemin}. Lancez d\'abord : python tools/base.py init')
    chemin.parent.mkdir(parents=True, exist_ok=True)
    cx = sqlite3.connect(chemin); cx.row_factory = sqlite3.Row
    cx.executescript(SCHEMA.read_text(encoding='utf-8'))
    return cx

def un(cx, sql, *p):
    v = cx.execute(sql, p).fetchone()[0]
    return v or 0

def indicateurs(cx, jour=None):
    """Chiffres de la semaine écoulée (7 jours avant `jour`)."""
    jour = jour or dt.date.today().isoformat()
    debut = (dt.date.fromisoformat(jour) - dt.timedelta(days=7)).isoformat()
    actives = "statut NOT IN ('annulée', 'remboursée')"
    i = {
        'jour': jour, 'debut': debut,
        'commandes': un(cx, f"SELECT COUNT(*) FROM commandes WHERE cree_le > ? AND cree_le <= ? AND {actives}", debut, jour),
        'livrees': un(cx, "SELECT COUNT(*) FROM commandes WHERE livree_le > ? AND livree_le <= ?", debut, jour),
        'a_temps': un(cx, "SELECT COUNT(*) FROM commandes WHERE livree_le > ? AND livree_le <= ? AND livree_le <= echeance", debut, jour),
        'ca': un(cx, "SELECT SUM(montant) FROM argent WHERE sens='entrée' AND categorie='vente' AND le > ? AND le <= ?", debut, jour),
        'marge': un(cx, f"SELECT SUM(marge_nette) FROM commandes WHERE cree_le > ? AND cree_le <= ? AND {actives}", debut, jour),
        'depenses': un(cx, "SELECT SUM(montant) FROM argent WHERE sens='sortie' AND le > ? AND le <= ?", debut, jour),
        'tickets': un(cx, "SELECT COUNT(*) FROM tickets WHERE resolu_le > ? AND resolu_le <= ?", debut, jour),
        'factures': un(cx, "SELECT COUNT(*) FROM factures WHERE payee_le > ? AND payee_le <= ?", debut, jour),
        'prospects': un(cx, "SELECT COUNT(*) FROM prospects WHERE cree_le > ? AND cree_le <= ?", debut, jour),
        'attente': un(cx, "SELECT COUNT(*) FROM validations WHERE statut='en attente'"),
    }
    i['sources'] = [dict(r) for r in cx.execute(
        "SELECT COALESCE(source, 'inconnue') AS source, SUM(montant) AS montant FROM argent "
        "WHERE sens='entrée' AND categorie='vente' AND le > ? AND le <= ? GROUP BY 1 ORDER BY 2 DESC", (debut, jour))]
    lim = (dt.date.fromisoformat(jour) + dt.timedelta(days=4)).isoformat()
    sept = (dt.date.fromisoformat(jour) - dt.timedelta(days=7)).isoformat()
    trente = (dt.date.fromisoformat(jour) - dt.timedelta(days=30)).isoformat()
    r = []
    for x in cx.execute("SELECT id, produit, echeance FROM commandes WHERE statut IN ('payée','commandée','expédiée') AND echeance <= ? ORDER BY echeance", (lim,)):
        etat = 'dépassée' if x['echeance'] < jour else 'proche'
        r.append(('O03', f"Commande n°{x['id']} ({x['produit']}) : échéance de livraison {etat} ({x['echeance']})"))
    for x in cx.execute("SELECT nom, dernier_contact FROM partenariats WHERE etape IN ('contact','échange','proposition') AND dernier_contact <= ?", (sept,)):
        r.append(('P03', f"Accord « {x['nom']} » sans nouvelles depuis le {x['dernier_contact']}"))
    for x in cx.execute("SELECT id, note FROM avis WHERE note <= 3 AND repondu = 0"):
        r.append(('C10', f"Avis {x['note']}/5 n°{x['id']} sans réponse"))
    for x in cx.execute("SELECT numero, montant, emise_le FROM factures WHERE statut IN ('émise','en retard') AND emise_le <= ?", (trente,)):
        r.append(('A03', f"Facture {x['numero']} ({x['montant']:.2f} €) impayée depuis le {x['emise_le']}"))
    n = un(cx, "SELECT COUNT(*) FROM prospects WHERE niveau='chaud' AND statut='nouveau'")
    if n: r.append(('V02', f"{n} prospect(s) chaud(s) sans réponse"))
    i['risques'] = r
    i['a_valider'] = [dict(x) for x in cx.execute(
        "SELECT id, agent, sujet, fichier, priorite FROM validations WHERE statut='en attente' "
        "ORDER BY CASE priorite WHEN 'haute' THEN 0 WHEN 'normale' THEN 1 ELSE 2 END, cree_le")]
    return i

def euros(v): return f'{v:,.2f} €'.replace(',', ' ').replace('.', ',')

def statut(cx, jour=None):
    i = indicateurs(cx, jour)
    print(f"$ company status --monday   (semaine du {i['debut']} au {i['jour']})")
    print(f"commandes          {i['commandes']}")
    print(f"livrées à temps    {i['a_temps']} / {i['livrees']}")
    print(f"tickets résolus    {i['tickets']}")
    print(f"factures payées    {i['factures']}")
    print(f"chiffre d'affaires {euros(i['ca'])}")
    print(f"marge nette        {euros(i['marge'])}")
    print(f"en attente de vous {i['attente']}")

def attente(cx):
    for v in indicateurs(cx)['a_valider']:
        print(f"[{v['id']}] {v['priorite']:<7} {v['agent']:<4} {v['sujet']}" + (f"  -> {v['fichier']}" if v['fichier'] else ''))

def exemple():
    chemin = RACINE / 'donnees/exemple.db'
    if chemin.exists(): chemin.unlink()
    cx = connecter(chemin, creer=True)
    j = lambda n: (dt.date(2026, 11, 16) - dt.timedelta(days=n)).isoformat()
    cx.executemany("INSERT INTO fournisseurs (nom, plateforme, note, delai_moyen_jours) VALUES (?,?,?,?)",
                   [('EXEMPLE Atelier A', 'aliexpress', 4.8, 9), ('EXEMPLE Atelier B', 'ue', 4.7, 4)])
    cx.executemany("INSERT INTO clients (reference, segment) VALUES (?,?)", [(f'EX-{n}', 'premier-achat') for n in range(1, 6)])
    cmds = [(1, 'EXEMPLE Horloge à balancier', 'video-horloge', 59, 41, 12.2, j(12), j(-2), 'livrée', j(3)),
            (2, 'EXEMPLE Locomotive à vapeur', 'video-horloge', 49, 34, 10.4, j(10), j(-4), 'livrée', j(1)),
            (3, 'EXEMPLE Boîte à musique', 'pinterest', 39, 26, 10.1, j(6), j(-8), 'expédiée', None),
            (4, 'EXEMPLE Planétaire', 'google', 69, 48, 13.8, j(13), j(1), 'expédiée', None),
            (5, 'EXEMPLE Coffre-fort', 'video-coffre', 45, 31, 10.3, j(2), j(-12), 'payée', None)]
    for c in cmds:
        cx.execute("INSERT INTO commandes (client_id, produit, fournisseur_id, source, prix_ttc, cout_total, marge_nette, cree_le, echeance, statut, livree_le) VALUES (?,?,1,?,?,?,?,?,?,?,?)", c)
        cx.execute("INSERT INTO argent (le, sens, montant, categorie, source, commande_id) VALUES (?, 'entrée', ?, 'vente', ?, ?)", (c[6], c[3], c[2], c[0]))
    cx.execute("INSERT INTO argent (le, sens, montant, categorie) VALUES (?, 'sortie', 0, 'outil')", (j(5),))
    cx.execute("INSERT INTO tickets (categorie, statut, cree_le, resolu_le) VALUES ('aide', 'résolu', ?, ?)", (j(4), j(3)))
    cx.execute("INSERT INTO avis (commande_id, note, repondu) VALUES (2, 3, 0)")
    cx.execute("INSERT INTO partenariats (nom, type, etape, dernier_contact) VALUES ('EXEMPLE Créatrice déco', 'createur', 'proposition', ?)", (j(9),))
    cx.execute("INSERT INTO prospects (source, pseudo_ou_entreprise, message, niveau, agent) VALUES ('tiktok', 'EXEMPLE pseudo', 'prix ?', 'chaud', 'V01')")
    cx.executemany("INSERT INTO validations (agent, sujet, fichier, priorite) VALUES (?,?,?,?)", [
        ('C10', 'Réponse publique à un avis 3/5 (EXEMPLE)', None, 'haute'),
        ('M03', 'Vidéo « Horloge à balancier » prête à publier (EXEMPLE)', 'medias/EXEMPLE.mp4', 'normale'),
        ('O02', 'Commande fournisseur n°5 à passer (EXEMPLE)', None, 'haute')])
    cx.commit()
    print(f'Base d\'exemple créée (données fictives) : {chemin.relative_to(RACINE)}')
    return cx

def main(argv):
    base = BASE
    if '--base' in argv:
        k = argv.index('--base'); base = RACINE / argv[k + 1]; del argv[k:k + 2]
    cmd = argv[0] if argv else 'statut'
    if cmd == 'init':
        connecter(base, creer=True).commit(); print(f'Base prête : {base}')
    elif cmd == 'statut': statut(connecter(base))
    elif cmd == 'attente': attente(connecter(base))
    elif cmd == 'valider':
        cx = connecter(base); d = 'approuvé' if argv[2] == 'oui' else 'refusé'
        cx.execute("UPDATE validations SET statut=?, decide_le=datetime('now') WHERE id=?", (d, int(argv[1]))); cx.commit(); print(f'Validation {argv[1]} : {d}')
    elif cmd == 'sauvegarde':
        connecter(base)
        cible = DEPOT / 'donnees/sauvegardes' / f'entreprise-{dt.datetime.now():%Y-%m-%d-%H%M}.db'
        cible.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(base, cible); print(f'Sauvegarde : {cible}')
    elif cmd == 'exemple': exemple()
    else: sys.exit(__doc__)

if __name__ == '__main__':
    main(sys.argv[1:])
