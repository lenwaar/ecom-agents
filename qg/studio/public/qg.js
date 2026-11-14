// QG en direct : page branchée sur le serveur local (même flux Server-Sent Events que le Studio).
// Mode « En direct » par défaut ; le mode « Simulation d'une journée » reprend la maquette pour la démonstration
// (aucune écriture, aucun appel au serveur, aucun chiffre présenté comme réel).
(() => {
"use strict";
const { PIECES, EQUIPE, AGENTS } = window.QG;
const Q = window.QG;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MENTION_HUMAIN = "à faire par toi ou par Cowork sur ton accord";
const SANS_NOUVELLES_MS = 30 * 60 * 1000;
const LIBELLE_ETAT = { actif: "au travail", attend: "attend ta validation", repos: "au repos", pret: "prêt, pas encore utilisé", absent: "pas encore installé" };

// ---------- Dessin des postes (repris de la maquette) ----------
function ecranSVG(t, c) {
  switch (t) {
    case "barres": return `<g class="anim-barres"><rect x="70" y="52" width="9" height="22" rx="2" fill="${c}"/><rect x="83" y="52" width="9" height="22" rx="2" fill="${c}"/><rect x="96" y="52" width="9" height="22" rx="2" fill="${c}"/><rect x="109" y="52" width="9" height="22" rx="2" fill="${c}"/></g>`;
    case "lignes": return `<g class="anim-lignes"><rect x="68" y="50" width="52" height="5" rx="2" fill="${c}"/><rect x="68" y="60" width="44" height="5" rx="2" fill="${c}"/><rect x="68" y="70" width="34" height="5" rx="2" fill="${c}"/></g>`;
    case "cube": return `<g class="anim-tourne"><rect x="84" y="50" width="22" height="22" rx="3" fill="none" stroke="${c}" stroke-width="3"/><circle cx="95" cy="61" r="4" fill="${c}"/></g>`;
    case "timeline": return `<rect x="66" y="52" width="56" height="7" rx="2" fill="${c}" opacity=".5"/><rect x="66" y="64" width="38" height="7" rx="2" fill="#3FD0C9" opacity=".6"/><g class="anim-tete"><rect x="68" y="47" width="2.5" height="30" fill="#fff"/></g>`;
    case "coches": return `<path d="M70 56l4 4 7-8M70 70l4 4 7-8" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="86" y="54" width="32" height="5" rx="2" fill="${c}" opacity=".6"/><rect x="86" y="68" width="26" height="5" rx="2" fill="${c}" opacity=".6"/>`;
    case "courbe": return `<path d="M68 74 L80 66 L90 70 L102 56 L118 50" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/><g class="anim-pulse"><circle cx="118" cy="50" r="3.5" fill="${c}"/></g>`;
    case "envoi": return `<g class="anim-pulse"><path d="M80 66 L110 52 L100 74 L95 66 Z" fill="${c}"/></g>`;
  }
  return "";
}
function posteSVG(a) {
  const tete = a.robot
    ? `<rect x="80" y="70" width="30" height="24" rx="7" fill="#C9CFDA"/><circle cx="89" cy="82" r="3" fill="${a.c}"/><circle cx="101" cy="82" r="3" fill="${a.c}"/><rect x="93" y="62" width="4" height="8" fill="#C9CFDA"/>`
    : `<circle cx="95" cy="82" r="13" fill="#EBCF9F" stroke="rgba(110,78,36,.5)"/><path d="M82 80 Q84 66 95 67 Q107 66 108 80 Q102 73 95 74 Q88 73 82 80Z" fill="${a.cheveux}"/><circle cx="94" cy="84" r="1.6" fill="#2A1E14"/><circle cx="103" cy="84" r="1.6" fill="#2A1E14"/>`;
  return `<svg class="scene" viewBox="0 0 190 150" aria-hidden="true">
    <rect x="38" y="96" width="114" height="10" rx="5" fill="#2A2347"/>
    <rect x="125" y="84" width="8" height="12" fill="#2A2347"/>
    <rect x="92" y="40" width="74" height="44" rx="6" class="ecran-fond"/>
    <g class="contenu" transform="translate(34,0)">${ecranSVG(a.ecran, a.c)}</g>
    <g transform="translate(-36,0)"><g class="corps-perso"><rect x="74" y="92" width="42" height="34" rx="12" fill="${a.id === "toi" ? "#C8A15A" : a.c}" opacity=".9"/>${tete}</g></g>
    <rect x="22" y="112" width="146" height="14" rx="4" fill="#2C2550"/>
    <rect x="30" y="118" width="40" height="3" rx="1.5" fill="${a.c}" opacity=".7"/><rect x="120" y="118" width="40" height="3" rx="1.5" fill="${a.c}" opacity=".7"/>
    <rect x="30" y="126" width="6" height="18" fill="#221C40"/><rect x="154" y="126" width="6" height="18" fill="#221C40"/>
  </svg>`;
}

// ---------- Construction de l'étage et de la liste ----------
let filtre = "tous";
let etatsAffiches = {};
function construire() {
  const etage = $("etage"), liste = $("liste"), filtres = $("filtres");
  const boutons = [["tous", "Tous", "Toute l'équipe"], ["actif", "Au travail", "Agents au travail"], ["attend", "À valider", "Attend ta validation"], ["repos", "Au repos", "Au repos, prêts ou pas encore installés"],
    ...PIECES.map(p => [p.id, p.id, `${p.id} · ${p.nom}`])];
  boutons.forEach(([f, l, titre], i) => {
    if (i === 4) { const s = document.createElement("span"); s.className = "sep"; filtres.appendChild(s); }
    const b = document.createElement("button"); b.type = "button"; b.textContent = l; b.dataset.f = f; b.title = titre;
    b.setAttribute("aria-pressed", String(f === "tous"));
    if (f.length === 1) b.setAttribute("aria-label", `Pôle ${titre}`);
    b.onclick = () => { filtre = f; filtres.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); appliquerFiltre(); };
    filtres.appendChild(b);
  });
  PIECES.forEach(p => {
    const occ = EQUIPE.filter(a => a.p === p.id);
    const d = document.createElement("section"); d.className = "piece" + (p.large ? " large" : ""); d.id = "piece-" + p.id;
    d.style.setProperty("--c", p.c); d.style.setProperty("--n", Math.min(occ.length, p.large ? 4 : 2));
    d.setAttribute("aria-label", `Pôle ${p.id} · ${p.nom}`); d.dataset.piece = p.id;
    d.innerHTML = `<h3><span class="code">${p.id}</span>${esc(p.nom)}<small id="pc-${p.id}">au repos</small></h3><div class="postes"></div>`;
    d.querySelector("h3").title = p.salle;
    const postes = d.querySelector(".postes");
    occ.forEach(a => {
      const x = document.createElement("div"); x.className = "poste"; x.id = "poste-" + a.id; x.style.setProperty("--c", a.c); x.dataset.etat = "repos";
      x.innerHTML = `<div class="bulle" id="bulle-${a.id}">${esc(a.role)}</div>${posteSVG(a)}<div class="nom">${esc(a.prenom)}</div>`;
      postes.appendChild(x);
      const m = document.createElement("div"); m.className = "membre"; m.id = "membre-" + a.id; m.style.setProperty("--c", a.c); m.tabIndex = 0;
      m.dataset.etat = "repos"; m.dataset.piece = a.p; m.dataset.type = a.type; m.setAttribute("role", "button");
      m.setAttribute("aria-label", `${a.prenom}, ${a.agent || a.id}, pôle ${a.p} : voir sa pièce`);
      m.innerHTML = `<div class="pastille">${a.p}</div><div style="min-width:0"><div class="n">${esc(a.prenom)} <small>${esc(a.agent || a.id)}</small></div><div class="st" id="st-${a.id}">au repos</div></div><span class="voyant"><span class="visually-hidden" id="voyant-${a.id}">au repos</span></span>`;
      const aller = () => $("piece-" + a.p).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      m.onclick = aller; m.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); aller(); } };
      liste.appendChild(m);
    });
    etage.appendChild(d);
  });
}

// ---------- Affichage d'un poste et des compteurs ----------
function afficher(id, s) {
  etatsAffiches[id] = s;
  const a = EQUIPE.find(x => x.id === id);
  ["poste-", "membre-"].forEach(pre => {
    const el = $(pre + id); if (!el) return;
    el.classList.toggle("actif", s.e === "actif"); el.classList.toggle("attend", s.e === "attend");
    el.classList.toggle("fantome", s.e === "pret"); el.classList.toggle("absent", s.e === "absent");
    el.dataset.etat = s.e;
  });
  $("bulle-" + id).textContent = s.e === "actif" || s.e === "attend" ? (s.st || a.role) : a.role;
  $("st-" + id).textContent = s.st || LIBELLE_ETAT[s.e];
  $("voyant-" + id).textContent = LIBELLE_ETAT[s.e];
}
function majCompteurs() {
  const r = Q.resume(etatsAffiches);
  $("k-actifs").textContent = r.agentsActifs;
  $("en-cours").textContent = r.enCours.length ? r.enCours.join(", ") + " au travail" : "au repos";
  PIECES.forEach(p => {
    $("piece-" + p.id).classList.toggle("vive", r.pieces[p.id].actifs > 0);
    $("pc-" + p.id).textContent = r.pieces[p.id].texte;
  });
  $("k-pieces").textContent = r.piecesActives;
  appliquerFiltre();
}
function appliquerFiltre() {
  const f = Q.filtrer(etatsAffiches, filtre);
  EQUIPE.forEach(a => { const m = $("membre-" + a.id); m.classList.toggle("estompe", !f.membres[a.id]); m.dataset.visible = f.membres[a.id] ? "oui" : "non"; });
  PIECES.forEach(p => { const el = $("piece-" + p.id); el.classList.toggle("estompe", !f.pieces[p.id]); el.dataset.visible = f.pieces[p.id] ? "oui" : "non"; });
}

// ---------- Journal ----------
function journal(qui, texte, heure, sujet) {
  const j = $("journal"), a = EQUIPE.find(x => x.id === qui);
  const d = document.createElement("div"); d.className = "ev"; if (a) d.style.setProperty("--c", a.id === "toi" ? "#E8C06E" : a.c);
  const h = (heure || new Date().toLocaleTimeString("fr-FR")).slice(0, 5);
  const tete = sujet ? `<b>${esc(sujet)}</b> ` : a ? `<b>${esc(a.prenom)}</b> · ` : "";
  d.innerHTML = `<time>${esc(h)}</time><div>${tete}${esc(texte)}</div>`;
  j.prepend(d); while (j.children.length > 60) j.lastChild.remove();
}
function paquet(de, vers, texte) {
  return new Promise(res => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) return res();
    const A = $("poste-" + de), B = $("poste-" + vers);
    if (!A || !B) return res();
    const ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect();
    if (!ra.width || !rb.width) return res();
    const p = document.createElement("div"); p.className = "paquet"; p.textContent = texte; p.setAttribute("aria-hidden", "true"); document.body.appendChild(p);
    const x0 = ra.left + ra.width / 2, y0 = ra.top + ra.height * .35, x1 = rb.left + rb.width / 2, y1 = rb.top + rb.height * .35;
    p.style.left = x0 + "px"; p.style.top = y0 + "px"; p.style.transform = "translate(-50%,-50%) scale(.6)";
    requestAnimationFrame(() => requestAnimationFrame(() => { p.style.transform = `translate(calc(-50% + ${x1 - x0}px), calc(-50% + ${y1 - y0}px)) scale(1)`; }));
    setTimeout(() => { p.style.opacity = "0"; setTimeout(() => { p.remove(); res(); }, 300); }, 1150);
  });
}

// ---------- Synchro en cours ----------
const LIBELLE_TACHE = { fait: "fait", afaire: "à faire", encours: "en cours", bloque: "bloqué" };
function rendreTaches(taches, nom, compte) {
  $("nom-synchro").textContent = nom;
  $("compte-synchro").textContent = compte || "";
  const z = $("synchro");
  if (!taches.length) { z.innerHTML = `<div class="vide">Aucune tâche dans cette synchro.</div>`; return; }
  z.innerHTML = taches.map(t => {
    const qui = (t.agents || []).map(n => { const a = EQUIPE.find(x => x.id === n); return a ? `${a.prenom} (${n})` : n; }).join(", ");
    return `<article class="tache ${esc(t.affiche)}" data-tache="${esc(t.id)}" data-statut="${esc(t.affiche)}">
      <div class="t">${esc(t.id)} <span>${esc(LIBELLE_TACHE[t.affiche] || t.libelle || "—")}</span></div>
      ${t.titre ? `<h4>${esc(t.titre)}</h4>` : ""}${t.texte ? `<p>${esc(t.texte)}</p>` : ""}
      ${t.statut === "bloque" ? `<span class="raison">Raison : ${esc(t.raison || "—")}</span>` : ""}
      ${qui ? `<span class="qui">${esc(qui)}</span>` : ""}
    </article>`;
  }).join("");
}
function rendreSynchro(s) {
  if (!s || !s.source) return rendreTaches([], "—", "coordination/de-cowork.md introuvable");
  if (!s.synchro) return rendreTaches([], "—", "aucune section « Synchro n°… » dans de-cowork.md");
  const y = s.synchro, n = y.taches.length;
  const parts = [`${y.compte.fait} faite${y.compte.fait > 1 ? "s" : ""} sur ${n}`];
  if (y.compte.afaire) parts.push(`${y.compte.afaire} à faire`);
  if (y.compte.bloque) parts.push(`${y.compte.bloque} bloquée${y.compte.bloque > 1 ? "s" : ""}`);
  rendreTaches(Q.tachesAffichees(etat, y), `synchro n°${y.numero}${y.titre ? " · " + y.titre : ""}`, (y.precision ? y.precision + " · " : "") + parts.join(" · "));
}

// =====================================================================
// MODE EN DIRECT
// =====================================================================
let mode = "direct", etat = Q.creerEtat(), source = null, dernierEtat = null, enConfirmation = null;
const activite = {};

function ageEvenement(heure) {
  const m = /^(\d{2}):(\d{2}):(\d{2})/.exec(heure || "");
  if (!m) return 0;
  const maintenant = new Date(), ev = new Date(maintenant);
  ev.setHours(+m[1], +m[2], +m[3], 0);
  let age = maintenant - ev;
  if (age < -60000) age += 24 * 3600 * 1000;
  return Math.max(0, age);
}
function rafraichir(ids) {
  ids.forEach(id => afficher(id, Q.etatDe(etat, id)));
  if (ids.length) majCompteurs();
}
function traiter(ev, anime) {
  const r = Q.appliquer(etat, ev);
  r.changes.forEach(id => { if (etat.actifs[id]) activite[id] = Date.now() - ageEvenement(ev.heure); });
  rafraichir(r.changes);
  if (r.journal) journal(r.journal.qui, r.journal.texte, ev.heure, r.journal.sujet);
  if (r.vol && anime) paquet(r.vol.de, r.vol.vers, r.vol.texte);
  if (r.changes.length && dernierEtat) rendreSynchro(dernierEtat.synchro);
}
// Un poste actif sans nouvelles depuis 30 minutes repasse au repos (agent arrêté sans événement de fin).
setInterval(() => {
  if (mode !== "direct") return;
  const ids = Object.keys(etat.actifs).filter(id => id !== "cowork" && Date.now() - (activite[id] || 0) > SANS_NOUVELLES_MS);
  ids.forEach(id => { delete etat.actifs[id]; etat.derniers[id] = "Sans nouvelles depuis 30 min"; });
  rafraichir(ids);
}, 15000);

function lien(texte, classe) { const l = $("etat-lien"); l.textContent = texte; l.className = "etat-lien " + (classe || ""); }
function connecter() {
  if (source) source.close();
  source = new EventSource("/api/direct");
  source.addEventListener("open", () => lien("en direct", "vivant"));
  source.addEventListener("error", () => lien(source.readyState === 2 ? "serveur arrêté" : "reconnexion…", "coupe"));
  source.addEventListener("etat", e => { if (mode === "direct") rendreEtat(JSON.parse(e.data)); });
  source.addEventListener("historique", e => {
    if (mode !== "direct") return;
    JSON.parse(e.data).forEach(ev => traiter(ev, false));
    rafraichir(EQUIPE.map(a => a.id));
    document.body.dataset.pret = "oui";
  });
  source.addEventListener("evenement", e => { if (mode === "direct") traiter(JSON.parse(e.data), true); });
}

// ---------- Livrables à valider (même règle que le Studio) ----------
function rendreOks(e) {
  const z = $("oks");
  z.innerHTML = e.livrables.length ? "" : `<div class="vide">Rien à valider pour l'instant.</div>`;
  e.livrables.forEach(l => {
    const a = EQUIPE.find(x => x.type === "agent" && x.id === l.agent);
    const d = document.createElement("div"); d.className = "ok-item"; d.dataset.fichier = l.fichier; d.dataset.agent = l.agent || "";
    if (a) d.style.setProperty("--c", a.c);
    d.innerHTML = `<div style="min-width:0">${esc(l.titre)}<small><span class="qui">${esc(a ? a.prenom : l.agent || "agent —")}</span> · ${esc(l.agent || "agent —")} · ${esc(l.fichier)}</small></div>` +
      `<button class="btn" type="button" aria-label="Valider ${esc(l.fichier)}">Valider</button>`;
    d.querySelector("button").onclick = () => ouvrirConfirmation(d, l);
    z.appendChild(d);
    if (l.fichier === enConfirmation) ouvrirConfirmation(d, l, false);
  });
  $("nb-ok").textContent = e.livrables.length;
  $("k-ok").textContent = e.livrables.length;
}
function ouvrirConfirmation(d, o, focus = true) {
  document.querySelectorAll(".confirmer").forEach(c => c.remove());
  enConfirmation = o.fichier;
  const c = document.createElement("div"); c.className = "confirmer"; c.setAttribute("role", "group"); c.setAttribute("aria-label", "Confirmer la validation");
  c.innerHTML = `Passer <b>${esc(o.fichier)}</b> au statut « validé » ? Seul l'en-tête du fichier change (statut, valide_par: humain, date). Rien n'est publié ni envoyé.
    <div class="actions"><button class="btn" type="button" data-action="confirmer">Confirmer la validation</button><button class="btn fantome" type="button" data-action="annuler">Annuler</button></div><div class="message" aria-live="assertive"></div>`;
  d.appendChild(c);
  const msg = c.querySelector(".message");
  c.querySelector('[data-action="annuler"]').onclick = () => { enConfirmation = null; c.remove(); d.querySelector("button").focus(); };
  c.querySelector('[data-action="confirmer"]').onclick = async ev => {
    ev.target.disabled = true; msg.className = "message"; msg.textContent = "Validation…";
    try {
      const r = await fetch("/api/valider", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fichier: o.fichier }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.erreur || "Erreur " + r.status);
      enConfirmation = null;
      journal("toi", "as validé un livrable", undefined, "Tu");
      d.remove();
      if (dernierEtat) {
        dernierEtat.livrables = dernierEtat.livrables.filter(l => l.fichier !== o.fichier);
        const r2 = dernierEtat.equipe && dernierEtat.equipe.parAgent[o.agent];
        if (r2) r2.aValider = r2.aValider.filter(l => l.fichier !== o.fichier);
        rendreEtat(dernierEtat);
      }
    } catch (err) {
      msg.className = "message erreur"; msg.textContent = err.message; ev.target.disabled = false;
    }
  };
  if (focus) c.querySelector('[data-action="confirmer"]').focus();
}

function rendreEtat(e) {
  dernierEtat = e;
  Q.appliquerEquipe(etat, e.equipe, e.livrables);
  // Comparaison avec ce qui est affiché (l'état du serveur peut avoir été corrigé sur place après une validation).
  rafraichir(EQUIPE.map(a => a.id).filter(id => JSON.stringify(Q.etatDe(etat, id)) !== JSON.stringify(etatsAffiches[id])));
  const cw = Q.appliquerCowork(etat, e.cowork, e.synchro);
  cw.changes.forEach(id => { if (etat.actifs[id]) activite[id] = Date.now(); });
  rafraichir(cw.changes);
  if (cw.journal) journal(cw.journal.qui, cw.journal.texte, undefined, cw.journal.sujet);
  rendreOks(e);
  rendreSynchro(e.synchro);
  const eq = e.equipe || {};
  $("k-liv").textContent = eq.duJour === null || eq.duJour === undefined ? "—" : eq.duJour;
  const installes = eq.agents ? AGENTS.filter(id => eq.agents.some(a => a.nom === id)).length : null;
  const N = AGENTS.length;
  $("k-pieces-s").textContent = `sur ${PIECES.length}`;
  $("k-actifs-s").textContent = installes === null ? `sur ${N} agents (liste illisible)` : installes === N ? `sur ${N} agents` : `sur ${N} agents (${installes} installés)`;
  $("nb-agents").textContent = installes === null ? `${N} agents` : `${installes} sur ${N} installés`;
  (eq.agents || []).forEach(a => { const m = $("membre-" + a.nom); if (m && a.description) m.title = a.description; });
  const np = Q.nonPlaces(etat);
  $("nonplaces").hidden = !np.length;
  $("nonplaces").textContent = np.length ? `Installés, pas encore placés dans une pièce : ${np.join(", ")}.` : "";
  $("src-journal").textContent = e.sources.journal.split(/[\\/]/).pop();
  rendreEntreprise(e.entreprise);
}

// ---------- L'entreprise : 137 fiches par département + file de la base ----------
const PHASE_TXT = { maintenant: "maintenant", avant: "avant lancement", apres: "après lancement" };
function rendreEntreprise(ent) {
  const z = $("entreprise");
  if (!z) return;
  if (!ent) { $("nb-fiches").textContent = "—"; z.innerHTML = `<div class="vide">Dossier entreprise/agents/ introuvable.</div>`; return; }
  $("nb-fiches").textContent = `${ent.total} agents`;
  z.innerHTML = ent.departements.map(d => {
    const porteurs = Object.entries(d.porteurs).sort((a, b) => b[1] - a[1]).map(([p, n]) => `${esc(p)} ${n}`).join(" · ");
    const phases = Object.entries(d.phases).filter(([, n]) => n).map(([k, n]) => `<span class="ph ph-${k}">${n} ${PHASE_TXT[k]}</span>`).join("");
    const liste = d.fiches.map(f => `<li><b>${esc(f.code)}</b> ${esc(f.nom)} <i>${esc(f.porteur)}</i></li>`).join("");
    return `<details class="dept"><summary><span class="dept-code">${esc(d.code)}</span><span class="dept-nom">${esc(d.nom)}</span><span class="dept-n">${d.total}</span></summary>
      <div class="dept-ph">${phases}</div><div class="dept-p">${porteurs}</div><ul>${liste}</ul></details>`;
  }).join("");
  const v = ent.validations, f = $("file-base");
  if (v === null) { f.innerHTML = `<div class="vide">Base illisible ici (Node 22.13 ou plus, et <code>py tools/base.py init</code>).</div>`; $("nb-base").textContent = "—"; return; }
  $("nb-base").textContent = v.length;
  f.innerHTML = v.length ? v.map(x => `<div class="ligne-base${x.priorite === "haute" ? " haute" : ""}"><b>n° ${x.id}</b> <span class="code">${esc(x.agent)}</span> ${esc(x.sujet)}</div>`).join("")
    + `<p class="aide-base">Décider : <code>py tools/base.py valider &lt;n°&gt; oui|non</code></p>` : `<div class="vide">Rien n'attend votre décision.</div>`;
}
function demarrerDirect() {
  etat = Q.creerEtat(); dernierEtat = null; enConfirmation = null;
  $("journal").innerHTML = "";
  $("k-liv-t").textContent = "Livrables du jour"; $("k-liv-s").textContent = "datés d'aujourd'hui dans outputs/";
  $("k-ok").textContent = "—"; $("k-liv").textContent = "—";
  rafraichir(EQUIPE.map(a => a.id));
  rendreTaches([], "—", "");
  connecter();
}

// =====================================================================
// MODE SIMULATION (maquette, aucune écriture, aucun appel au serveur)
// =====================================================================
let jeton = 0, livr = 0, oks = [];
const pause = ms => new Promise((res, rej) => { const j = jeton; setTimeout(() => j === jeton ? res() : rej("stop"), ms); });
function maj(id, e, st) { afficher(id, { e, st: st || "" }); majCompteurs(); }
async function travaille(id, st, ms) { maj(id, "actif", st); await pause(ms); }
function rendreOksSim() {
  const z = $("oks");
  z.innerHTML = oks.length ? "" : `<div class="vide">Rien à valider pour l'instant.</div>`;
  oks.forEach(o => {
    const d = document.createElement("div"); d.className = "ok-item" + (o.pulse ? " pulse" : "");
    d.innerHTML = `<div>${esc(o.texte)}<small${o.bouton === false ? ' class="mention"' : ""}>${esc(o.sous || "")}</small></div>` + (o.bouton === false ? "" : `<button class="btn" type="button">Valider (simulation)</button>`);
    const b = d.querySelector("button"); if (b) b.onclick = () => { oks = oks.filter(x => x !== o); rendreOksSim(); o.ok && o.ok(); };
    z.appendChild(d);
  });
  $("nb-ok").textContent = oks.length; $("k-ok").textContent = oks.length;
}
const demander = o => new Promise(res => { o.ok = res; oks.unshift(o); rendreOksSim(); });
const T = [
  { id: "S1", titre: "Hugo compare des fournisseurs européens" }, { id: "S2", titre: "Basile calcule les marges réelles" },
  { id: "S3", titre: "Louise audite le fournisseur retenu" }, { id: "S4", titre: "Clara et Iris : fiche et visuels du nouveau produit" },
  { id: "S5", titre: "Nils met la fiche dans le site local" }, { id: "S6", titre: "Jade et Théo : la vidéo de lancement" },
  { id: "S7", titre: "Malo prépare une pub en pause, Inès répond aux messages" }
];
function etape(i) { rendreTaches(T.map((t, k) => ({ ...t, affiche: k < i ? "fait" : k === i ? "encours" : "afaire" })), "simulation d'une journée", "exemple de démonstration, aucune donnée réelle"); }
function livre() { livr++; $("k-liv").textContent = livr; }
async function journee() {
  journal("cowork", "Synchro du jour écrite dans de-cowork.md (simulation).");
  await travaille("cowork", "Prépare la synchro", 2200); maj("cowork", "actif", "Suit la synchro");
  etape(0); await paquet("cowork", "sourcing-produits", "synchro du jour");
  await travaille("sourcing-produits", "Compare des fournisseurs UE", 3200);
  journal("sourcing-produits", "Comparatif livré : prix, délai, stock, preuves datées (simulation)."); livre();
  maj("sourcing-produits", "repos", "Comparatif livré"); await paquet("sourcing-produits", "pilotage-finance", "prix d'achat");
  etape(1); await travaille("pilotage-finance", "Calcule les marges réelles", 3000);
  journal("pilotage-finance", "Marges calculées, cotisations comprises (simulation)."); livre();
  maj("pilotage-finance", "repos", "Marges livrées"); await paquet("pilotage-finance", "conformite-qa", "produits retenus");
  etape(2); await travaille("conformite-qa", "Audit GPSR et fournisseur", 3000);
  journal("conformite-qa", "Audit du fournisseur terminé (simulation)."); livre();
  maj("conformite-qa", "attend", "Attend ta validation");
  await demander({ texte: "Retenir le fournisseur (simulation)", sous: "sourcing + finance + audit · la commande reste faite par toi", pulse: true });
  journal("toi", "Fournisseur retenu (simulation, rien n'est commandé)."); maj("conformite-qa", "repos", "Audit validé");
  etape(3); await paquet("conformite-qa", "redacteur-catalogue", "fiche fournisseur");
  maj("studio-visuel", "actif", "Prépare les visuels");
  await travaille("redacteur-catalogue", "Écrit la fiche produit", 3200);
  journal("redacteur-catalogue", "Fiche écrite avec le bloc sécurité (simulation)."); livre();
  maj("redacteur-catalogue", "repos", "Fiche livrée"); await pause(800);
  journal("studio-visuel", "Visuels prêts (simulation)."); livre();
  maj("studio-visuel", "repos", "Visuels livrés");
  etape(4); await paquet("redacteur-catalogue", "developpeur-web", "fiche + visuels");
  await travaille("developpeur-web", "Met la fiche dans le site", 2600);
  maj("auto-liens", "actif", "Vérifie les liens"); await pause(1600);
  journal("auto-liens", "Vérification des liens terminée (simulation)."); maj("auto-liens", "repos", "Vérification terminée");
  journal("developpeur-web", "Site reconstruit en local. Rien n'est en ligne (simulation)."); livre();
  maj("developpeur-web", "repos", "Fiche intégrée");
  etape(5); await paquet("developpeur-web", "createur-contenu", "nouveau produit");
  await travaille("createur-contenu", "Écrit le script de lancement", 2800);
  maj("createur-contenu", "attend", "Attend ta validation");
  await demander({ texte: "Valider le script de la vidéo de lancement (simulation)", sous: "createur-contenu · aucun fichier modifié", pulse: true });
  journal("toi", "Script validé (simulation)."); maj("createur-contenu", "repos", "Script validé");
  await paquet("createur-contenu", "studio-video", "script validé");
  maj("studio-video", "actif", "Monte la vidéo"); await travaille("piper", "Voix et sous-titres", 2400);
  maj("piper", "repos", "Voix livrée"); await paquet("piper", "studio-video", "voix + sous-titres");
  await pause(2600); journal("studio-video", "Vidéo 9:16 rendue (simulation)."); livre();
  maj("studio-video", "repos", "Vidéo rendue");
  maj("auto-verif", "actif", "Vérifie les livrables"); await pause(1400); maj("auto-verif", "repos", "Vérification terminée");
  etape(6); await paquet("studio-video", "media-acquisition", "vidéo");
  maj("service-client", "actif", "Prépare des réponses");
  await travaille("media-acquisition", "Prépare une pub en pause", 2800);
  journal("media-acquisition", "Pub préparée en pause, jamais activée sans toi (simulation).");
  maj("media-acquisition", "attend", "Pub en pause, à toi d'activer");
  journal("service-client", "Brouillons de réponse prêts (simulation)."); livre();
  maj("service-client", "attend", "Brouillons à relire");
  oks.unshift({ texte: "Relire et envoyer les réponses clients", sous: "service-client · " + MENTION_HUMAIN, bouton: false }, { texte: "Activer la pub", sous: "media-acquisition · " + MENTION_HUMAIN, bouton: false }); rendreOksSim();
  maj("cowork", "repos", "Synchro terminée"); journal("cowork", "Synchro terminée (simulation).");
  rendreTaches(T.map(t => ({ ...t, affiche: "fait" })), "simulation d'une journée", "exemple de démonstration, aucune donnée réelle");
  await pause(7000);
  oks = []; rendreOksSim(); EQUIPE.forEach(a => maj(a.id, "repos", "")); prets();
  return journee();
}
function prets() { ["gestion-commandes", "crm-email", "veille-outils"].forEach(id => maj(id, "pret", "")); }
function demarrerSimulation() {
  if (source) { source.close(); source = null; }
  lien("simulation", "");
  jeton++; livr = 0; oks = []; enConfirmation = null; rendreOksSim(); $("journal").innerHTML = "";
  $("src-journal").textContent = "simulation";
  $("k-liv").textContent = "0"; $("k-liv-t").textContent = "Livrables du jour"; $("k-liv-s").textContent = "dans cette simulation";
  $("nonplaces").hidden = true;
  EQUIPE.forEach(a => afficher(a.id, { e: "repos", st: "" })); prets(); majCompteurs(); etape(-1);
  journee().catch(() => {});
}

// ---------- Boutons de mode ----------
const bR = $("m-reel"), bS = $("m-sim");
bR.onclick = () => { if (mode === "direct") return; mode = "direct"; jeton++; bR.setAttribute("aria-pressed", "true"); bS.setAttribute("aria-pressed", "false"); demarrerDirect(); };
bS.onclick = () => { if (mode === "simulation") return; mode = "simulation"; bS.setAttribute("aria-pressed", "true"); bR.setAttribute("aria-pressed", "false"); demarrerSimulation(); };

construire();
demarrerDirect();
})();
