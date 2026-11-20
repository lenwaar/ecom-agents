// Page Marketing du QG : file « à valider » (boutons Valider / Refuser qui changent seulement un statut local)
// et suivi des revenus par post. Seuls appels : /api/marketing et /api/marketing/decision, sur ce serveur local.
"use strict";
(function () {
  const eur = v => v === null || v === undefined ? "—" : v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const $ = id => document.getElementById(id);
  const el = (tag, classe, texte) => { const e = document.createElement(tag); if (classe) e.className = classe; if (texte !== undefined) e.textContent = texte; return e; };

  function carte(x, avecBoutons) {
    const li = el("li", "element");
    li.dataset.id = x.id;
    const tete = el("div", "element-tete");
    tete.append(el("span", "badge type", x.type || "post"), el("strong", "", x.titre || x.id), el("span", "doux", [x.plateforme, x.code, x.agent].filter(Boolean).join(" · ")));
    if (x.statut !== "à-valider") tete.append(el("span", "badge " + (x.statut === "validé" ? "valide" : "refuse"), x.statut));
    li.append(tete);
    if (x.texte) li.append(el("p", "element-texte", x.texte));
    if (x.livrable) li.append(el("p", "doux", "Livrable : " + x.livrable));
    if (x.statut === "validé") li.append(el("p", "doux", `Validé le ${x.date_decision || "?"} : à publier à la main, depuis vos comptes.`));
    if (x.statut === "refusé") li.append(el("p", "doux", `Refusé le ${x.date_decision || "?"} : ne sera pas publié.`));
    if (avecBoutons) {
      const actions = el("div", "actions");
      const oui = el("button", "bouton valider", "Valider");
      const non = el("button", "bouton refuser", "Refuser");
      oui.type = non.type = "button";
      oui.addEventListener("click", () => decider(x.id, "validé", [oui, non]));
      non.addEventListener("click", () => decider(x.id, "refusé", [oui, non]));
      actions.append(oui, non);
      li.append(actions);
    }
    return li;
  }

  function lignePost(p) {
    const tr = document.createElement("tr");
    const cellule = t => { const td = document.createElement("td"); td.textContent = t; return td; };
    tr.append(cellule(p.sujet ? `${p.sujet} (${p.id})` : p.id), cellule(p.plateforme || "—"), cellule(p.date || "—"),
      cellule(String(p.commandes)), cellule(eur(p.ca_ttc)), cellule(eur(p.marge_nette)));
    return tr;
  }

  function decider(id, decision, boutons) {
    boutons.forEach(b => { b.disabled = true; });
    fetch("/api/marketing/decision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, decision }) })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        $("message").textContent = ok ? `« ${id} » : ${decision}. Rien n'a été publié.` : (d.erreur || "Décision refusée.");
        $("message").classList.toggle("erreur", !ok);
        charger();
      })
      .catch(() => { $("message").textContent = "Impossible d'enregistrer la décision : le serveur du QG est-il lancé ?"; $("message").classList.add("erreur"); boutons.forEach(b => { b.disabled = false; }); });
  }

  function afficher(d) {
    const f = d.file, p = d.posts;
    $("note-publication").textContent = f.note || $("note-publication").textContent;
    $("source-file").textContent = f.fichier;
    const attente = f.elements.filter(x => x.statut === "à-valider");
    const decides = f.elements.filter(x => x.statut !== "à-valider");
    $("message-file").textContent = f.message || (attente.length ? "" : "Rien à valider : tout a été décidé.");
    $("message-file").classList.toggle("erreur", f.etat === "invalide");
    $("file").replaceChildren(...attente.map(x => carte(x, true)));
    $("bloc-decides").hidden = !decides.length;
    $("decides").replaceChildren(...decides.map(x => carte(x, false)));

    $("source-posts").textContent = p.fichier;
    $("message-posts").textContent = p.message || "";
    $("message-posts").classList.toggle("erreur", p.etat === "invalide");
    $("table-posts").hidden = !p.reel.length;
    $("posts").replaceChildren(...p.reel.map(lignePost));
    $("total-posts").textContent = p.reel.length ? `Total attribué (chaque commande comptée une fois) : ${eur(p.total_reel.ca_ttc)} TTC, marge nette ${eur(p.total_reel.marge_nette_totale)}.` : "";

    const ex = f.exemples.length || p.exemple.length;
    $("bloc-exemple").hidden = !ex;
    $("file-exemple").replaceChildren(...f.exemples.map(x => carte(x, false)));
    $("table-posts-exemple").hidden = !p.exemple.length;
    $("posts-exemple").replaceChildren(...p.exemple.map(lignePost));

    const avert = (f.avertissements || []).concat(p.avertissements || []);
    $("bloc-avert").hidden = !avert.length;
    $("avertissements").replaceChildren(...avert.map(t => el("li", "", t)));
    document.body.dataset.pret = "oui";
  }

  function charger() {
    fetch("/api/marketing", { cache: "no-store" }).then(r => r.json()).then(d => {
      if (!$("message").classList.contains("erreur") && $("message").textContent === "Chargement…") $("message").textContent = "";
      afficher(d);
    }).catch(() => {
      $("message").textContent = "Impossible de lire /api/marketing : le serveur du QG est-il lancé ?";
      $("message").classList.add("erreur");
      document.body.dataset.pret = "oui";
    });
  }
  charger();
})();
