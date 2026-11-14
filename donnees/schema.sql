-- Système de référence de la boutique (SQLite, gratuit, local).
-- Correspond aux bases de la vidéo : leads.db, customers.db, projects.db, money.db, knowledge.db.
-- Création : python tools/base.py init

PRAGMA foreign_keys = ON;

-- leads.db : personnes qui montrent une intention d'achat (V01, V14)
CREATE TABLE IF NOT EXISTS prospects (
    id INTEGER PRIMARY KEY,
    cree_le TEXT NOT NULL DEFAULT (date('now')),
    source TEXT NOT NULL,               -- tiktok, instagram, pinterest, site, email, pro
    type TEXT NOT NULL DEFAULT 'particulier' CHECK (type IN ('particulier', 'pro')),
    pseudo_ou_entreprise TEXT,          -- jamais d'adresse ni de téléphone ici
    message TEXT,
    niveau TEXT NOT NULL DEFAULT 'tiède' CHECK (niveau IN ('chaud', 'tiède', 'froid')),
    statut TEXT NOT NULL DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'répondu', 'relancé', 'gagné', 'perdu')),
    dernier_contact TEXT,
    agent TEXT                          -- code de la fiche, ex. V01
);

-- accords : créateurs, revendeurs, entreprises, fournisseurs (P01 à P18)
CREATE TABLE IF NOT EXISTS partenariats (
    id INTEGER PRIMARY KEY,
    cree_le TEXT NOT NULL DEFAULT (date('now')),
    nom TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('createur', 'revendeur', 'entreprise', 'fournisseur', 'media', 'autre')),
    etape TEXT NOT NULL DEFAULT 'contact' CHECK (etape IN ('contact', 'échange', 'proposition', 'signé', 'actif', 'terminé', 'perdu')),
    montant_prevu REAL,
    dernier_contact TEXT,
    notes TEXT
);

-- customers.db
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    cree_le TEXT NOT NULL DEFAULT (date('now')),
    reference TEXT UNIQUE NOT NULL,     -- identifiant Stripe ou interne, pas le nom complet
    segment TEXT,                       -- premier-achat, fidele, cadeau, pro (C15)
    satisfaction TEXT CHECK (satisfaction IN ('satisfait', 'à surveiller', 'mécontent')),
    accord_marketing INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS fournisseurs (
    id INTEGER PRIMARY KEY,
    nom TEXT NOT NULL,
    plateforme TEXT,                    -- aliexpress, officiel, ue
    note REAL,
    delai_moyen_jours REAL,
    delai_max_jours REAL,
    incidents INTEGER NOT NULL DEFAULT 0,
    secours_de INTEGER REFERENCES fournisseurs(id)
);

-- projects.db : ici, une commande = un projet à livrer en 14 jours
CREATE TABLE IF NOT EXISTS commandes (
    id INTEGER PRIMARY KEY,
    cree_le TEXT NOT NULL DEFAULT (date('now')),
    client_id INTEGER REFERENCES clients(id),
    produit TEXT NOT NULL,
    fournisseur_id INTEGER REFERENCES fournisseurs(id),
    source TEXT,                        -- utm_source : video-xxx, pinterest, google... (I02)
    prix_ttc REAL NOT NULL,
    cout_total REAL,                    -- produit + livraison + frais Stripe
    marge_nette REAL,                   -- après cotisations 12,3 % et SAV 5 % (I07)
    echeance TEXT NOT NULL DEFAULT (date('now', '+14 days')),
    statut TEXT NOT NULL DEFAULT 'payée' CHECK (statut IN ('payée', 'commandée', 'expédiée', 'livrée', 'retournée', 'remboursée', 'annulée')),
    numero_suivi TEXT,
    livree_le TEXT
);

-- tickets du service client
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY,
    cree_le TEXT NOT NULL DEFAULT (date('now')),
    commande_id INTEGER REFERENCES commandes(id),
    categorie TEXT NOT NULL CHECK (categorie IN ('avant-achat', 'suivi', 'retour', 'réclamation', 'aide', 'pièce', 'rgpd', 'autre')),
    priorite TEXT NOT NULL DEFAULT 'normale' CHECK (priorite IN ('haute', 'normale', 'basse')),
    statut TEXT NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'brouillon prêt', 'résolu')),
    resolu_le TEXT
);

CREATE TABLE IF NOT EXISTS avis (
    id INTEGER PRIMARY KEY,
    cree_le TEXT NOT NULL DEFAULT (date('now')),
    commande_id INTEGER REFERENCES commandes(id),
    note INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
    plateforme TEXT,
    repondu INTEGER NOT NULL DEFAULT 0
);

-- money.db : entrées et sorties (livre des recettes A06, registre des achats A07)
CREATE TABLE IF NOT EXISTS argent (
    id INTEGER PRIMARY KEY,
    le TEXT NOT NULL DEFAULT (date('now')),
    sens TEXT NOT NULL CHECK (sens IN ('entrée', 'sortie')),
    montant REAL NOT NULL CHECK (montant >= 0),
    categorie TEXT NOT NULL,            -- vente, fournisseur, frais-stripe, pub, outil, urssaf, echantillon
    source TEXT,                        -- pour les ventes : même valeur que commandes.source
    commande_id INTEGER REFERENCES commandes(id),
    justificatif TEXT
);

CREATE TABLE IF NOT EXISTS factures (
    id INTEGER PRIMARY KEY,
    numero TEXT UNIQUE,
    commande_id INTEGER REFERENCES commandes(id),
    montant REAL NOT NULL,
    statut TEXT NOT NULL DEFAULT 'à émettre' CHECK (statut IN ('à émettre', 'émise', 'payée', 'en retard')),
    emise_le TEXT,
    payee_le TEXT
);

-- « You approve » : tout ce qui attend l'humain (voir entreprise/interruptions.md)
CREATE TABLE IF NOT EXISTS validations (
    id INTEGER PRIMARY KEY,
    cree_le TEXT NOT NULL DEFAULT (datetime('now')),
    agent TEXT NOT NULL,                -- code de la fiche
    sujet TEXT NOT NULL,
    fichier TEXT,                       -- livrable à relire dans outputs/
    priorite TEXT NOT NULL DEFAULT 'normale' CHECK (priorite IN ('haute', 'normale', 'basse')),
    statut TEXT NOT NULL DEFAULT 'en attente' CHECK (statut IN ('en attente', 'approuvé', 'refusé')),
    decide_le TEXT
);

-- serveurs de signaux de la vidéo (visites, abonnés, vues) : chiffres saisis depuis les exports natifs
CREATE TABLE IF NOT EXISTS signaux (
    id INTEGER PRIMARY KEY,
    le TEXT NOT NULL DEFAULT (date('now')),
    canal TEXT NOT NULL,                -- site, tiktok, instagram, pinterest, youtube
    mesure TEXT NOT NULL,               -- visites, vues, abonnes, clics
    valeur REAL NOT NULL
);

-- serveur d'agents de la vidéo (head, workflows, traces) : journal de qui a fait quoi
CREATE TABLE IF NOT EXISTS journal_agents (
    id INTEGER PRIMARY KEY,
    le TEXT NOT NULL DEFAULT (datetime('now')),
    agent TEXT NOT NULL,
    action TEXT NOT NULL,
    fichier TEXT
);
