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
  const majuscule = t => t ? t[0].toUpperCase() + t.slice(1) : t;
  const minuscule = t => t ? t[0].toLowerCase() + t.slice(1) : t;

  // ---------- Traduction des événements en phrases lisibles ----------
  // Le journal JSONL reste brut ; seule la page traduit. Ce qu'on ne sait pas traduire est masqué.
  const AUTRES_AGENTS = {
    "developpeur-web": "Le développeur web", "architecte-web": "L'architecte web", "redacteur-catalogue": "Le rédacteur du catalogue",
    "sourcing-produits": "L'agent sourcing", "Explore": "Un assistant de recherche", "general-purpose": "Un assistant", "Plan": "Un assistant"
  };
  function nomAgent(type) {
    const poste = EQUIPE.find(a => a.agent === type);
    if (poste) return poste.prenom;
    if (AUTRES_AGENTS[type]) return AUTRES_AGENTS[type];
    return /^[a-z][a-z-]{1,40}$/i.test(type || "") ? `L'agent ${type.replace(/-/g, " ")}` : "Un agent";
  }

  function decrireFichier(chemin) {
    const c = String(chemin || "").trim().replace(/\\/g, "/");
    const base = c.split("/").pop();
    const regles = [
      [/BRIEF-STUDIO/i, "le brief du studio"], [/BRIEF-QG/i, "le brief du QG"],
      [/(^|\/)de-cowork\.md$/, "les consignes de Cowork"], [/(^|\/)vers-cowork\.md$/, "le compte rendu pour Cowork"],
      [/prochaine-synchro\//, "la prochaine synchro"], [/a-installer\//, "un fichier à installer"],
      [/journal-direct\./, "le journal en direct"],
      [/(^|\/)CLAUDE\.md$/, "les règles du projet"], [/retours-experience\.md$/, "les retours d'expérience"],
      [/knowledge\/marque\.md$/, "la charte de la marque"], [/knowledge\/politiques\.md$/, "les politiques de la boutique"],
      [/knowledge\//, "la base de connaissances"], [/\.claude\/agents\//, "une fiche d'agent"], [/\.claude\//, "un réglage de Claude Code"],
      [/marketing\/calendrier/, "le calendrier de publication"], [/marketing\//, "un document marketing"],
      [/outputs\/qg\/.*\.png$/i, "une capture"], [/outputs\/[^/]+\.md$/, "un livrable"],
      [/\.(mp4|mov|webm)$/i, "une vidéo"], [/\.(png|jpe?g|webp|gif|svg)$/i, "une image"], [/\.(wav|mp3|ogg|flac)$/i, "un fichier audio"],
      [/\.srt$/i, "les sous-titres"], [/(^|\/)licences\.md$/, "les licences des médias"],
      [/\.test\.js$/, "un test"], [/site\/src\/content\/produits\//, "une fiche produit"],
      [/\.(js|mjs|py|css|html|json|ts|astro|ps1|sh)$/i, "du code"], [/docs\//, "une documentation"], [/\.md$/i, "une note"]
    ];
    for (const [motif, texte] of regles) if (motif.test(c)) return texte;
    return base ? "un fichier" : null;
  }

  // Commande shell -> action en français (jamais la commande brute).
  const COMMANDES = [
    [/\bpiper\b/i, "génère la voix"], [/whisper/i, "prépare les sous-titres"],
    [/normaliser_lufs|loudnorm|ebur128/i, "règle le volume du son"], [/\bffprobe\b/i, "vérifie une vidéo"],
    [/\bffmpeg\b|\bblender\b|\brender|\brendu/i, "lance un rendu"],
    [/verifier_livrables/i, "vérifie les livrables"], [/verifier_liens/i, "vérifie les liens"],
    [/\bnpm\s+(run\s+)?test\b|node\s+--test|pytest/i, "lance les tests"],
    [/\bnpm\s+run\s+build\b|astro\s+build/i, "construit le site"], [/\bnpm\s+(ci|install|i)\b/i, "installe les dépendances"],
    [/\bnpm\s+(run\s+)?(start|dev|preview)\b|serveur\.js/i, "démarre un aperçu local"],
    [/playwright|chromium|screenshot|capture/i, "prend une capture"],
    [/\bgit\s+push\b/i, "envoie les changements sur GitHub"], [/\bgit\s+commit\b/i, "enregistre un commit"],
    [/\bgit\s+add\b/i, "prépare un commit"], [/\bgit\s+(status|diff|log|show|grep)\b/i, "relit l'historique des changements"],
    [/\bgit\b/i, "utilise git"], [/taskkill|stop-process|\bkill\b/i, "arrête un programme"],
    [/\bcurl\b|invoke-webrequest/i, "interroge un serveur local"],
    [/assembl/i, "assemble la vidéo"], [/^until\b|\bsleep\b|\bwait\b/i, "attend la fin d'un travail en cours"],
    [/\bsed\s+-i\b|\bprintf\b.*>>?\s*\S|\becho\b.*>>?\s*\S/i, "modifie un fichier"],
    [/^(ls|dir|cat|head|tail|grep|rg|find|wc|od|file|stat|sed\s+-n|echo|printf|\{|for\b.*\bdo\b.*\b(head|cat|ls|grep)|get-childitem|get-content)\b/i, "parcourt les fichiers"],
    [/\b(mkdir|cp|mv|rm|copy-item|move-item|remove-item)\b/i, "range des fichiers"],
    [/\b(py|python3?|node|npx|bash|sh)\b/i, "lance un script"]
  ];
  function decrireCommande(cmd) {
    // On ignore les « cd dossier && » et les « VAR=valeur ; » du début : seule compte l'action.
    let c = String(cmd || "").trim(), avant;
    do { avant = c; c = c.replace(/^(cd\s+("[^"]*"|'[^']*'|\S+)|[A-Z_][A-Z0-9_]*=("[^"]*"|'[^']*'|\S*))\s*(&&|;)\s*/i, ""); } while (c !== avant);
    for (const [motif, texte] of COMMANDES) if (motif.test(c)) return texte;
    // « FF=…/ffmpeg.exe && $FF … » : l'outil n'est nommé que dans la variable du début.
    for (const [motif, texte] of COMMANDES) if (motif.test(String(cmd || ""))) return texte;
    return "lance une commande";
  }

  // Une phrase affichable ne contient ni balise, ni commande, ni chemin, ni code.
  function propre(t) {
    return typeof t === "string" && t.length > 0 && t.length <= 140 && !/[<>`{}\\|$]/.test(t) && !/\S+\/\S+\/\S+/.test(t) && !/\b[a-z]+_[a-z_]+\b/.test(t);
  }

  // Prédicat (sans sujet) pour l'outil utilisé, ou null s'il faut masquer l'événement.
  function predicatOutil(ev) {
    const t = texteSansAgent(ev);
    switch (ev.outil) {
      case "Read": case "Write": case "Edit": case "MultiEdit": {
        const f = decrireFichier(t.replace(/^(Read|Write|Edit|MultiEdit)\s+/, ""));
        if (!f) return null;
        return `${ev.outil === "Read" ? "lit" : ev.outil === "Write" ? "écrit" : "modifie"} ${f}`;
      }
      case "Bash": return decrireCommande(t.replace(/^Bash\s*:\s*/, ""));
      case "Glob": case "Grep": return "cherche dans les fichiers";
      case "WebSearch": return "fait une recherche sur le web";
      case "WebFetch": return "consulte une page web";
      case "SubagentHandback": return "rend son rapport";
      case "Skill": return "suit une méthode du studio";
      default: return null;
    }
  }

  // Demande envoyée à Claude Code : les messages automatiques (agents, tâches de fond, rappels) sont masqués.
  const BALISES_SYSTEME = /^<(agent-message|task-notification|system-reminder|local-command|command-|bash-|user-memory|tool_|function)/i;
  function phraseDemande(texte) {
    let t = String(texte || "").replace(/^DEMANDE · /, "").trim();
    if (BALISES_SYSTEME.test(t)) return null;
    const commande = /^\/([\w-]+)/.exec(t);
    if (commande) return { sujet: "Tu", texte: commande[1] === "cowork" ? "as lancé la synchro avec Cowork" : "as lancé une commande de Claude Code" };
    t = t.replace(/<[^>]*>/g, " ").replace(/`+/g, "").replace(/https?:\S+/g, "…").replace(/\S*[\\/]\S*/g, "…");
    t = court(t, 90);
    if (!t || !propre(`« ${t} »`)) return { sujet: "Tu", texte: "as envoyé une demande à Claude Code" };
    return { sujet: "Tu", texte: `as demandé : « ${t} »` };
  }

  function phraseNotification(texte) {
    const t = String(texte || "");
    if (/permission|autoris/i.test(t)) return { sujet: "Claude Code", texte: "attend ton autorisation" };
    if (/waiting for your input|attend/i.test(t)) return { sujet: "Claude Code", texte: "attend ta réponse" };
    return { sujet: "Claude Code", texte: "attend ton attention" };
  }

  // Entrée du journal de la page : { qui, sujet, texte, phrase }, ou null si l'événement est masqué.
  function entree(qui, sujet, texte) {
    if (!texte) return null;
    const phrase = `${sujet} ${texte}`;
    if (!propre(phrase)) return null;
    return { qui, sujet, texte, phrase };
  }

  function creerEtat() {
    const postes = {};
    EQUIPE.forEach(a => { postes[a.id] = { e: "repos", st: "au repos", p: 0 }; });
    return { postes, pile: [], dernierFini: null, voixPar: null, aValider: {}, ids: {}, finis: {}, cowork: false };
  }

  // Remet un poste au repos, ou « attend ta validation » s'il a un livrable à valider.
  function poserAuRepos(etat, id, st) {
    const n = etat.aValider[id] || 0;
    if (n > 0) etat.postes[id] = { e: "attend", st: n > 1 ? `${n} livrables attendent ta validation` : "Attend ta validation", p: 100 };
    else etat.postes[id] = { e: "repos", st: st || "au repos", p: st ? 100 : 0 };
  }
  function retirerDeLaPile(etat, qui) {
    const i = etat.pile.lastIndexOf(qui);
    if (i >= 0) etat.pile.splice(i, 1);
  }

  // Quel agent s'arrête ? Par son agent_id si le journal le donne, sinon l'ancienne logique.
  function agentQuiSArrete(etat, ev) {
    const aid = ev.agent_id || "";
    if (aid) {
      etat.finis[aid] = true;
      return ev.agent || etat.ids[aid] || "";       // identifiant inconnu : on ne touche à aucun poste
    }
    if (ev.agent) return ev.agent;
    return etat.pile.length ? etat.pile[etat.pile.length - 1] : "";   // repli : dernier agent lancé
  }

  // Applique un événement du journal. Renvoie ce que la page doit afficher.
  function appliquer(etat, ev) {
    const sortie = { journal: null, vol: null, changes: [] };
    const acteur = ev.agent || "";
    const posteActeur = POSTE_DE_L_AGENT[acteur] || null;
    const changer = id => { if (id && !sortie.changes.includes(id)) sortie.changes.push(id); };

    if (ev.type === "UserPromptSubmit") {
      const p = phraseDemande(ev.texte);
      sortie.journal = p && entree("toi", p.sujet, p.texte);
      return sortie;
    }
    if (ev.type === "Notification") {
      const p = phraseNotification(texteSansAgent(ev));
      sortie.journal = entree(null, p.sujet, p.texte);
      return sortie;
    }
    if (ev.type === "Stop") {
      sortie.journal = entree(null, "Claude Code", "a répondu");
      return sortie;
    }

    if (ev.type === "SubagentStop") {
      const qui = agentQuiSArrete(etat, ev);
      if (qui) retirerDeLaPile(etat, qui);
      const id = POSTE_DE_L_AGENT[qui];
      if (id) { poserAuRepos(etat, id, "Terminé"); changer(id); }
      if (qui && etat.voixPar === qui) { etat.voixPar = null; poserAuRepos(etat, "voix"); changer("voix"); }
      etat.dernierFini = qui || null;
      sortie.journal = entree(id || null, qui ? nomAgent(qui) : "Un agent", "a terminé");
      return sortie;
    }

    if (ev.type !== "PostToolUse") return sortie;              // type inconnu : masqué

    // Lancement d'un agent par la session principale (ou par un agent).
    if ((ev.outil === "Agent" || ev.outil === "Task") && ev.cible) {
      const cible = ev.cible, aid = ev.agent_id || "";
      if (aid) etat.ids[aid] = cible;
      // Agent lancé au premier plan : Claude Code ne journalise le lancement qu'après sa fin.
      if (aid && etat.finis[aid]) return sortie;
      etat.pile.push(cible);
      const id = POSTE_DE_L_AGENT[cible];
      const deId = POSTE_DE_L_AGENT[etat.dernierFini];
      if (id && deId && deId !== id) sortie.vol = { de: deId, vers: id, texte: "livrable" };
      etat.dernierFini = null;
      if (id) { etat.postes[id] = { e: "actif", st: "Se met au travail", p: -1 }; changer(id); }
      const tache = /\bT(\d{1,3})\b/.exec(texteSansAgent(ev));
      const suite = tache ? ` (tâche T${tache[1]})` : "";
      sortie.journal = id ? entree(id, nomAgent(cible), "se met au travail" + suite)
        : entree(posteActeur, acteur ? nomAgent(acteur) : "Claude Code", "lance " + minuscule(nomAgent(cible)) + suite);
      return sortie;
    }

    // Action d'un agent (outil utilisé).
    if (acteur && ev.agent_id && !etat.ids[ev.agent_id]) etat.ids[ev.agent_id] = acteur;
    if (acteur && !etat.pile.includes(acteur)) etat.pile.push(acteur);
    const predicat = predicatOutil(ev);
    const ligne = predicat ? entree(posteActeur, acteur ? nomAgent(acteur) : "Claude Code", predicat) : null;
    if (posteActeur) {
      etat.postes[posteActeur] = { e: "actif", st: ligne ? majuscule(predicat) : "Au travail", p: -1 };
      changer(posteActeur);
    }
    if (ev.outil === "Bash" && OUTILS_VOIX.test(ev.texte || "")) {
      etat.voixPar = acteur || etat.voixPar || "";
      etat.postes.voix = { e: "actif", st: "Voix et sous-titres en local", p: -1 }; changer("voix");
    } else if (etat.postes.voix.e === "actif" && etat.voixPar === acteur) {
      etat.voixPar = null; poserAuRepos(etat, "voix", "Voix livrée"); changer("voix");
    }
    sortie.journal = ligne;
    return sortie;
  }

  // Cowork (poste « pub ») : au travail quand le serveur signale un fichier écrit par Cowork dans coordination/.
  function appliquerCowork(etat, cowork) {
    const sortie = { journal: null, changes: [] };
    const actif = !!(cowork && cowork.actif);
    if (actif) {
      const texte = cowork.texte || "met à jour la coordination";
      if (!etat.cowork) sortie.journal = entree("pub", "Cowork", texte);
      if (etat.postes.pub.e !== "actif" || etat.postes.pub.st !== majuscule(texte)) { etat.postes.pub = { e: "actif", st: majuscule(texte), p: -1 }; sortie.changes.push("pub"); }
    } else if (etat.cowork) {
      poserAuRepos(etat, "pub"); sortie.changes.push("pub");
    }
    etat.cowork = actif;
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

  const api = { EQUIPE, POSTE_DE_L_AGENT, creerEtat, appliquer, appliquerLivrables, appliquerCowork, court, propre, decrireFichier, decrireCommande,
    // Réutilisés par le QG (qg-direct.js) pour traduire le journal en phrases.
    predicatOutil, phraseDemande, phraseNotification, entree, texteSansAgent, majuscule, minuscule, OUTILS_VOIX };
  if (typeof module === "object" && module.exports) module.exports = api;
  else racine.Direct = api;
})(typeof window !== "undefined" ? window : globalThis);
