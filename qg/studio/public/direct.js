// Correspondance entre le journal de Claude Code et les 8 postes du studio.
// Logique pure (aucun accès à la page) : utilisée par app.js dans le navigateur et par les tests Node.
(function (racine) {
  "use strict";

  const EQUIPE = [
    { id: "veille", prenom: "Margaux", role: "Veille", agent: "analyste-marche", c: "#5AA8F2", ecran: "barres", cheveux: "#5B3A1E" },
    { id: "script", prenom: "Jade", role: "Scénariste", agent: "createur-contenu", c: "#A98BF5", ecran: "lignes", cheveux: "#2A1E14" },
    { id: "visuels", prenom: "Iris", role: "Visuels 3D", agent: "studio-visuel", c: "#F29A4A", ecran: "cube", cheveux: "#C0633F" },
    { id: "montage", prenom: "Théo", role: "Monteur", agent: "studio-video", c: "#F25FA0", ecran: "timeline", cheveux: "#1C1C24" },
    { id: "voix", prenom: "Piper", role: "Voix et sous-titres", agent: "outil local, piloté par Théo", c: "#3FD0C9", ecran: "onde", cheveux: "#3A3A44", robot: true },
    { id: "controle", prenom: "Louise", role: "Contrôle", agent: "conformite-qa", c: "#6BD58A", ecran: "coches", cheveux: "#8A5A2E" },
    { id: "pubs", prenom: "Malo", role: "Pubs", agent: "media-acquisition", c: "#F2645A", ecran: "courbe", cheveux: "#4A2C16" },
    { id: "pub", prenom: "Cowork", role: "Publication", agent: "avec ton accord", c: "#E8C06E", ecran: "envoi", cheveux: "#C8A15A" }
  ];
  const POSTE_DE_L_AGENT = {};
  EQUIPE.forEach(a => { if (/^[a-z-]+$/.test(a.agent)) POSTE_DE_L_AGENT[a.agent] = a.id; });
  const OUTILS_VOIX = /\b(piper|faster[-_ ]?whisper|whisper)\b/i;

  function court(t, n) {
    t = String(t || "").replace(/\s+/g, " ").trim();
    return t.length <= n ? t : t.slice(0, n - 1) + "…";
  }
  // Retire le préfixe « [agent] » ajouté par tools/journal_claude.py.
  function texteSansAgent(ev) { return String(ev.texte || "").replace(/^\[[^\]]+\]\s*/, ""); }

  function creerEtat() {
    const postes = {};
    EQUIPE.forEach(a => { postes[a.id] = { e: "repos", st: "au repos", p: 0 }; });
    return { postes, pile: [], dernierFini: null, voixPar: null, aValider: {} };
  }

  function resumeAction(ev) {
    const t = texteSansAgent(ev);
    if (ev.outil === "Write" || ev.outil === "Edit" || ev.outil === "Read") {
      const fichier = t.split(/[\\/]/).pop();
      return `${ev.outil === "Read" ? "Lit" : "Écrit"} ${fichier}`;
    }
    if (ev.outil === "Bash") return "Commande : " + court(t.replace(/^Bash :\s*/, ""), 60);
    return court(t, 60);
  }

  // Remet un poste au repos, ou « attend ta validation » s'il a un livrable à valider.
  function poserAuRepos(etat, id, st) {
    const n = etat.aValider[id] || 0;
    if (n > 0) etat.postes[id] = { e: "attend", st: n > 1 ? `${n} livrables attendent ta validation` : "Attend ta validation", p: 100 };
    else etat.postes[id] = { e: "repos", st: st || "au repos", p: st ? 100 : 0 };
  }

  // Applique un événement du journal. Renvoie ce que la page doit afficher.
  function appliquer(etat, ev) {
    const sortie = { journal: null, vol: null, changes: [] };
    const acteur = ev.agent || "";
    const posteActeur = POSTE_DE_L_AGENT[acteur] || null;
    const changer = id => { if (id && !sortie.changes.includes(id)) sortie.changes.push(id); };

    if (ev.type === "UserPromptSubmit") {
      sortie.journal = { qui: "toi", texte: court(String(ev.texte || "").replace(/^DEMANDE · /, ""), 160) };
      return sortie;
    }
    if (ev.type === "Notification") {
      sortie.journal = { qui: null, texte: "Attend l'humain : " + court(texteSansAgent(ev), 140) };
      return sortie;
    }
    if (ev.type === "Stop") {
      sortie.journal = { qui: null, texte: "Claude Code a répondu." };
      return sortie;
    }

    if (ev.type === "SubagentStop") {
      let qui = acteur;
      if (!qui) qui = etat.pile.length ? etat.pile[etat.pile.length - 1] : "";   // Claude Code ne nomme pas toujours l'agent
      etat.pile = etat.pile.filter(a => a !== qui);
      const id = POSTE_DE_L_AGENT[qui];
      if (id) { poserAuRepos(etat, id, "Terminé"); changer(id); }
      if (qui && etat.voixPar === qui) { etat.voixPar = null; poserAuRepos(etat, "voix"); changer("voix"); }
      etat.dernierFini = qui || null;
      sortie.journal = { qui: id || null, texte: qui ? (id ? "Terminé." : `${qui} a terminé.`) : "Un agent a terminé." };
      return sortie;
    }

    if (ev.type !== "PostToolUse") {
      sortie.journal = { qui: posteActeur, texte: court(texteSansAgent(ev), 160) };
      return sortie;
    }

    // Lancement d'un agent par la session principale (ou par un agent).
    if ((ev.outil === "Agent" || ev.outil === "Task") && ev.cible) {
      const cible = ev.cible;
      etat.pile = etat.pile.filter(a => a !== cible).concat(cible);
      const id = POSTE_DE_L_AGENT[cible];
      const deId = POSTE_DE_L_AGENT[etat.dernierFini];
      if (id && deId && deId !== id) sortie.vol = { de: deId, vers: id, texte: "livrable" };
      etat.dernierFini = null;
      if (id) { etat.postes[id] = { e: "actif", st: "Lancé, au travail", p: -1 }; changer(id); }
      const desc = court(texteSansAgent(ev).replace(/^Lance l'agent [^:]+:\s*/, ""), 120);
      sortie.journal = { qui: id || posteActeur, texte: id ? `Au travail : ${desc}` : `Lance ${cible} : ${desc}` };
      return sortie;
    }

    // Action d'un agent (outil utilisé).
    if (acteur && !etat.pile.includes(acteur)) etat.pile.push(acteur);
    if (posteActeur) { etat.postes[posteActeur] = { e: "actif", st: resumeAction(ev), p: -1 }; changer(posteActeur); }
    if (OUTILS_VOIX.test(ev.texte || "")) {
      etat.voixPar = acteur || etat.voixPar || "";
      etat.postes.voix = { e: "actif", st: "Voix et sous-titres en local", p: -1 }; changer("voix");
    } else if (etat.postes.voix.e === "actif" && etat.voixPar === acteur) {
      etat.voixPar = null; poserAuRepos(etat, "voix", "Voix livrée"); changer("voix");
    }
    sortie.journal = { qui: posteActeur, texte: (posteActeur || !acteur ? "" : `[${acteur}] `) + court(texteSansAgent(ev), 160) };
    return sortie;
  }

  // Met à jour les postes d'après les livrables « à-valider » de outputs/.
  function appliquerLivrables(etat, livrables) {
    const compte = {};
    (livrables || []).forEach(l => { const id = POSTE_DE_L_AGENT[l.agent]; if (id) compte[id] = (compte[id] || 0) + 1; });
    etat.aValider = compte;
    const changes = [];
    EQUIPE.forEach(a => {
      const s = etat.postes[a.id];
      if (s.e === "actif") return;
      const avant = JSON.stringify(s);
      if (compte[a.id]) poserAuRepos(etat, a.id);
      else if (s.e === "attend") etat.postes[a.id] = { e: "repos", st: "au repos", p: 0 };
      if (JSON.stringify(etat.postes[a.id]) !== avant) changes.push(a.id);
    });
    return changes;
  }

  const api = { EQUIPE, POSTE_DE_L_AGENT, creerEtat, appliquer, appliquerLivrables, court };
  if (typeof module === "object" && module.exports) module.exports = api;
  else racine.Direct = api;
})(typeof window !== "undefined" ? window : globalThis);
