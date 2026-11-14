// QG en direct : correspondance entre le journal de Claude Code, les livrables, la synchro
// et les pièces du QG. Logique pure (aucun accès à la page) : utilisée par qg.js dans le navigateur
// et par les tests Node. Les phrases du journal sont traduites par direct.js (mêmes règles que le Studio).
(function (racine) {
  "use strict";
  const D = typeof module === "object" && module.exports ? require("./direct.js") : racine.Direct;

  // Pièces : codes de pôle de docs/organisation.md, noms de la maquette docs/reference/qg-en-direct.html,
  // nom de la salle d'après docs/qg/BRIEF-QG.md.
  const PIECES = [
    { id: "A", nom: "Direction", salle: "Salle du conseil", c: "#E8C06E" },
    { id: "B", nom: "Marché", salle: "Salle des cartes", c: "#5AA8F2" },
    { id: "C", nom: "Fournisseurs", salle: "Entrepôt et quai", c: "#8FC25A" },
    { id: "D", nom: "Atelier web", salle: "Atelier web", c: "#3FD0C9" },
    { id: "E", nom: "Catalogue", salle: "Bibliothèque", c: "#D97BA6" },
    { id: "F", nom: "Studio", salle: "Studio", c: "#F25FA0", large: true },
    { id: "G", nom: "Croissance", salle: "Salle de croissance", c: "#8E8BF5" },
    { id: "H", nom: "Relation client", salle: "Accueil et courrier", c: "#5BD69A" },
    { id: "I", nom: "Finance", salle: "Coffre", c: "#D9A35B" },
    { id: "J", nom: "Conformité", salle: "Greffe", c: "#6BD58A" },
    { id: "K", nom: "Recherche", salle: "Laboratoire", c: "#5AC8F2" },
    { id: "V", nom: "Ventes", salle: "Comptoir", c: "#F28B5A" },
    { id: "Q", nom: "Automates", salle: "Quai des automates", c: "#A9B0C2" }
  ];

  // type « agent » : un des fichiers de .claude/agents/ (id = nom technique).
  // Les autres postes de la maquette : Cowork, toi, Piper (outil local) et deux scripts sans IA.
  const EQUIPE = [
    { id: "cowork", prenom: "Cowork", role: "Chef d'orchestre", agent: "Cowork", type: "cowork", p: "A", ecran: "lignes", cheveux: "#C8A15A" },
    { id: "cerveau", prenom: "Mémo", role: "Cerveau, page du lundi", type: "agent", p: "A", ecran: "barres", cheveux: "#3A2A1A" },
    { id: "toi", prenom: "Toi", role: "Décide", agent: "l'humain", type: "humain", p: "A", ecran: "coches", cheveux: "#2A1E14" },
    { id: "analyste-marche", prenom: "Margaux", role: "Veille marché", type: "agent", p: "B", ecran: "barres", cheveux: "#5B3A1E" },
    { id: "sourcing-produits", prenom: "Hugo", role: "Fournisseurs", type: "agent", p: "C", ecran: "lignes", cheveux: "#3A2A1A" },
    { id: "gestion-commandes", prenom: "Lina", role: "Commandes, stock", type: "agent", p: "C", ecran: "barres", cheveux: "#1C1C24" },
    { id: "architecte-web", prenom: "Victor", role: "Conception", type: "agent", p: "D", ecran: "cube", cheveux: "#4A2C16" },
    { id: "developpeur-web", prenom: "Nils", role: "Code du site", type: "agent", p: "D", ecran: "lignes", cheveux: "#C9A24A" },
    { id: "redacteur-catalogue", prenom: "Clara", role: "Fiches produits", type: "agent", p: "E", ecran: "lignes", cheveux: "#7A3E2A" },
    { id: "createur-produits-numeriques", prenom: "Félix", role: "Tableurs, modèles", type: "agent", p: "E", ecran: "barres", cheveux: "#3A2A1A" },
    { id: "createur-contenu", prenom: "Jade", role: "Scripts, calendrier", type: "agent", p: "F", ecran: "lignes", cheveux: "#2A1E14" },
    { id: "studio-visuel", prenom: "Iris", role: "Visuels 3D", type: "agent", p: "F", ecran: "cube", cheveux: "#C0633F" },
    { id: "studio-video", prenom: "Théo", role: "Montage", type: "agent", p: "F", ecran: "timeline", cheveux: "#1C1C24" },
    { id: "piper", prenom: "Piper", role: "Voix, sous-titres", agent: "outil local", type: "outil", p: "F", ecran: "barres", robot: true },
    { id: "media-acquisition", prenom: "Malo", role: "Pubs, SEO", type: "agent", p: "G", ecran: "courbe", cheveux: "#4A2C16" },
    { id: "service-client", prenom: "Inès", role: "Service client", type: "agent", p: "H", ecran: "lignes", cheveux: "#2A1E14" },
    { id: "crm-email", prenom: "Paul", role: "E-mails", type: "agent", p: "H", ecran: "envoi", cheveux: "#8A5A2E" },
    { id: "pilotage-finance", prenom: "Basile", role: "Marges, budget", type: "agent", p: "I", ecran: "courbe", cheveux: "#5B3A1E" },
    { id: "conformite-qa", prenom: "Louise", role: "Audit, droit", type: "agent", p: "J", ecran: "coches", cheveux: "#8A5A2E" },
    { id: "veille-outils", prenom: "Ada", role: "Outils, licences", type: "agent", p: "K", ecran: "barres", cheveux: "#1C1C24" },
    { id: "ventes", prenom: "Lucas", role: "Prospects, devis", type: "agent", p: "V", ecran: "courbe", cheveux: "#2A1E14" },
    { id: "partenariats", prenom: "Rose", role: "Créateurs, accords", type: "agent", p: "V", ecran: "envoi", cheveux: "#7A3E2A" },
    { id: "auto-verif", prenom: "Vérif.", role: "verifier_livrables", agent: "script sans IA", type: "automate", p: "Q", ecran: "coches", robot: true },
    { id: "auto-liens", prenom: "Liens", role: "verifier_liens", agent: "script sans IA", type: "automate", p: "Q", ecran: "coches", robot: true }
  ];
  EQUIPE.forEach(a => { a.c = PIECES.find(p => p.id === a.p).c; if (a.type === "agent") a.agent = a.id; });
  const AGENTS = EQUIPE.filter(a => a.type === "agent").map(a => a.id);

  // Outils sans IA repérés dans les commandes du journal.
  const OUTILS = [
    { id: "piper", motif: D.OUTILS_VOIX, st: "Voix et sous-titres en local", fin: "Voix livrée" },
    { id: "auto-verif", motif: /verifier_livrables/i, st: "Vérifie les livrables", fin: "Vérification terminée" },
    { id: "auto-liens", motif: /verifier_liens/i, st: "Vérifie les liens", fin: "Vérification terminée" }
  ];

  const AUTRES = { "Explore": "Un assistant de recherche", "general-purpose": "Un assistant", "Plan": "Un assistant" };
  function nomAgent(type) {
    const a = EQUIPE.find(x => x.type === "agent" && x.id === type);
    if (a) return a.prenom;
    if (AUTRES[type]) return AUTRES[type];
    return /^[a-z][a-z-]{1,40}$/i.test(type || "") ? `L'agent ${type.replace(/-/g, " ")}` : "Un agent";
  }
  const estPoste = id => EQUIPE.some(a => a.id === id);

  // ---------- État ----------
  function creerEtat() {
    return {
      actifs: {},          // id -> statut en une ligne (au travail)
      derniers: {},        // id -> dernière nouvelle (« Terminé »…)
      installes: null,     // liste des agents installés (null : pas encore lue)
      parAgent: {},        // résumé des livrables par agent (serveur)
      aValider: 0,         // total des livrables à valider
      vus: {},             // agents vus dans le journal
      pile: [], ids: {}, finis: {}, dernierFini: null,
      outils: {},          // id d'outil -> acteur qui l'a lancé
      taches: {},          // agent -> tâche Tnn de son lancement
      cowork: null         // { actif, texte }
    };
  }

  // État affiché d'un poste : { e: actif | attend | repos | pret | absent, st }.
  function etatDe(etat, id) {
    const a = EQUIPE.find(x => x.id === id);
    if (!a) return { e: "repos", st: "" };
    if (a.type === "agent" && etat.installes && !etat.installes.includes(id)) return { e: "absent", st: "pas encore installé" };
    if (etat.actifs[id]) return { e: "actif", st: etat.actifs[id] };
    if (a.type === "humain") {
      const n = etat.aValider;
      return n ? { e: "attend", st: n > 1 ? `${n} livrables à valider` : "1 livrable à valider" } : { e: "repos", st: "rien à valider" };
    }
    if (a.type === "agent") {
      const r = etat.parAgent[id];
      const n = r ? r.aValider.length : 0;
      if (n) return { e: "attend", st: n > 1 ? `${n} livrables à valider` : "1 livrable à valider" };
      if (etat.derniers[id]) return { e: "repos", st: etat.derniers[id] };
      if (r && r.dernier) return { e: "repos", st: `dernier livrable : ${r.dernier.date || "—"}` };
      if (etat.vus[id]) return { e: "repos", st: "au repos" };
      return { e: "pret", st: "prêt, pas encore utilisé" };
    }
    return { e: "repos", st: etat.derniers[id] || "au repos" };
  }
  function tous(etat) { const o = {}; EQUIPE.forEach(a => { o[a.id] = etatDe(etat, a.id); }); return o; }

  function retirerDeLaPile(etat, qui) { const i = etat.pile.lastIndexOf(qui); if (i >= 0) etat.pile.splice(i, 1); }
  function agentQuiSArrete(etat, ev) {
    const aid = ev.agent_id || "";
    if (aid) { etat.finis[aid] = true; return ev.agent || etat.ids[aid] || ""; }
    if (ev.agent) return ev.agent;
    return etat.pile.length ? etat.pile[etat.pile.length - 1] : "";
  }

  // Applique un événement du journal. Renvoie { journal, vol, changes } comme direct.js.
  function appliquer(etat, ev) {
    const sortie = { journal: null, vol: null, changes: [] };
    const changer = id => { if (id && estPoste(id) && !sortie.changes.includes(id)) sortie.changes.push(id); };
    const acteur = ev.agent || "";
    const posteActeur = AGENTS.includes(acteur) ? acteur : null;

    if (ev.type === "UserPromptSubmit") { const p = D.phraseDemande(ev.texte); sortie.journal = p && D.entree("toi", p.sujet, p.texte); return sortie; }
    if (ev.type === "Notification") { const p = D.phraseNotification(D.texteSansAgent(ev)); sortie.journal = D.entree(null, p.sujet, p.texte); return sortie; }
    if (ev.type === "Stop") { sortie.journal = D.entree(null, "Claude Code", "a répondu"); return sortie; }

    if (ev.type === "SubagentStop") {
      const qui = agentQuiSArrete(etat, ev);
      if (qui) retirerDeLaPile(etat, qui);
      if (AGENTS.includes(qui)) { delete etat.actifs[qui]; delete etat.taches[qui]; etat.derniers[qui] = "Terminé"; etat.vus[qui] = true; changer(qui); }
      for (const o of OUTILS) if (qui && etat.outils[o.id] === qui) { delete etat.outils[o.id]; delete etat.actifs[o.id]; etat.derniers[o.id] = o.fin; changer(o.id); }
      etat.dernierFini = qui || null;
      sortie.journal = D.entree(AGENTS.includes(qui) ? qui : null, qui ? nomAgent(qui) : "Un agent", "a terminé");
      return sortie;
    }
    if (ev.type !== "PostToolUse") return sortie;

    // Lancement d'un agent.
    if ((ev.outil === "Agent" || ev.outil === "Task") && ev.cible) {
      const cible = ev.cible, aid = ev.agent_id || "";
      if (aid) etat.ids[aid] = cible;
      if (aid && etat.finis[aid]) return sortie;             // lancé au premier plan : déjà terminé
      etat.pile.push(cible);
      const tache = /\bT(\d{1,3}[a-z]?)\b/.exec(D.texteSansAgent(ev));
      const suite = tache ? ` (tâche T${tache[1]})` : "";
      if (AGENTS.includes(cible)) {
        if (etat.dernierFini && AGENTS.includes(etat.dernierFini) && etat.dernierFini !== cible) sortie.vol = { de: etat.dernierFini, vers: cible, texte: "livrable" };
        etat.actifs[cible] = "Se met au travail"; etat.vus[cible] = true;
        if (tache) etat.taches[cible] = "T" + tache[1].toUpperCase(); else delete etat.taches[cible];
        changer(cible);
      }
      etat.dernierFini = null;
      sortie.journal = AGENTS.includes(cible) ? D.entree(cible, nomAgent(cible), "se met au travail" + suite)
        : D.entree(posteActeur, acteur ? nomAgent(acteur) : "Claude Code", "lance " + D.minuscule(nomAgent(cible)) + suite);
      return sortie;
    }

    // Action d'un agent ou de la session principale.
    if (acteur && ev.agent_id && !etat.ids[ev.agent_id]) etat.ids[ev.agent_id] = acteur;
    if (acteur && !etat.pile.includes(acteur)) etat.pile.push(acteur);
    const predicat = D.predicatOutil(ev);
    const ligne = predicat ? D.entree(posteActeur, acteur ? nomAgent(acteur) : "Claude Code", predicat) : null;
    if (posteActeur) { etat.actifs[posteActeur] = ligne ? D.majuscule(predicat) : "Au travail"; etat.vus[posteActeur] = true; changer(posteActeur); }
    for (const o of OUTILS) {
      if (ev.outil === "Bash" && o.motif.test(ev.texte || "")) {
        etat.outils[o.id] = acteur; etat.actifs[o.id] = o.st; changer(o.id);
      } else if (etat.actifs[o.id] && etat.outils[o.id] === acteur) {
        delete etat.outils[o.id]; delete etat.actifs[o.id]; etat.derniers[o.id] = o.fin; changer(o.id);
      }
    }
    sortie.journal = ligne;
    return sortie;
  }

  // État envoyé par le serveur (agents installés, livrables par agent). Renvoie les postes changés.
  function appliquerEquipe(etat, equipe, livrables) {
    const avant = tous(etat);
    if (equipe && Array.isArray(equipe.agents)) etat.installes = equipe.agents.map(a => a.nom);
    etat.parAgent = (equipe && equipe.parAgent) || {};
    etat.aValider = (livrables || []).length;
    const apres = tous(etat);
    return EQUIPE.filter(a => JSON.stringify(avant[a.id]) !== JSON.stringify(apres[a.id])).map(a => a.id);
  }

  // Cowork : au travail quand le serveur signale un fichier écrit par Cowork dans coordination/.
  function appliquerCowork(etat, cowork, synchro) {
    const sortie = { journal: null, changes: [] };
    const actif = !!(cowork && cowork.actif);
    const avant = JSON.stringify(etatDe(etat, "cowork"));
    if (actif) {
      const texte = cowork.texte || "met à jour la coordination";
      if (!(etat.cowork && etat.cowork.actif)) sortie.journal = D.entree("cowork", "Cowork", texte);
      etat.actifs.cowork = D.majuscule(texte);
    } else {
      delete etat.actifs.cowork;
      const s = synchro && synchro.synchro;
      etat.derniers.cowork = s ? `synchro n°${s.numero} : ${s.compte.fait} sur ${s.taches.length} faites` : "au repos";
    }
    etat.cowork = { actif };
    if (JSON.stringify(etatDe(etat, "cowork")) !== avant) sortie.changes.push("cowork");
    return sortie;
  }

  // Filtres : « tous », un état (« actif », « attend », « repos ») ou un code de pièce (« A » à « K », « Q »).
  // « repos » regroupe aussi « prêt, pas encore utilisé » et « pas encore installé ».
  function correspond(filtre, a, e) {
    if (filtre === "tous") return true;
    if (filtre === a.p) return true;
    if (filtre === "repos") return e === "repos" || e === "pret" || e === "absent";
    return filtre === e;
  }
  // etats : { id: { e, st } } (QG.tous(etat) en direct, ou l'état de la simulation).
  function filtrer(etats, filtre) {
    const membres = {}, pieces = {};
    EQUIPE.forEach(a => { membres[a.id] = correspond(filtre, a, (etats[a.id] || {}).e); });
    PIECES.forEach(p => { pieces[p.id] = filtre === p.id || EQUIPE.some(a => a.p === p.id && membres[a.id]); });
    return { membres, pieces };
  }

  // Indicateurs et étiquettes de pièce (aucun chiffre sans source).
  function resume(etats) {
    const agentsActifs = AGENTS.filter(id => etats[id].e === "actif");
    const pieces = {};
    PIECES.forEach(p => {
      const occ = EQUIPE.filter(a => a.p === p.id);
      const n = occ.filter(a => etats[a.id].e === "actif").length, w = occ.filter(a => etats[a.id].e === "attend").length;
      pieces[p.id] = { actifs: n, attend: w, texte: n ? `${n} au travail` : w ? `${w} attend` : "au repos" };
    });
    return {
      agentsActifs: agentsActifs.length,
      piecesActives: PIECES.filter(p => pieces[p.id].actifs > 0).length,
      enCours: EQUIPE.filter(a => etats[a.id].e === "actif").map(a => a.prenom),
      pieces
    };
  }

  // Tâches de la synchro : une tâche « à faire » dont l'agent lancé travaille passe « en cours ».
  function tachesAffichees(etat, synchro) {
    if (!synchro) return [];
    const enCours = new Set(Object.entries(etat.taches).filter(([id]) => etat.actifs[id]).map(([, t]) => t));
    return synchro.taches.map(t => ({ ...t, affiche: t.statut === "afaire" && enCours.has(t.id) ? "encours" : t.statut }));
  }

  // Agents installés absents du plan du QG (nouveaux fichiers dans .claude/agents/).
  function nonPlaces(etat) { return (etat.installes || []).filter(n => !estPoste(n)); }

  const api = { PIECES, EQUIPE, AGENTS, creerEtat, appliquer, appliquerEquipe, appliquerCowork, etatDe, tous, filtrer, resume, tachesAffichees, nonPlaces, nomAgent };
  if (typeof module === "object" && module.exports) module.exports = api;
  else racine.QG = api;
})(typeof window !== "undefined" ? window : globalThis);
