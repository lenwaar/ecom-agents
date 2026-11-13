// Studio en direct : page branchée sur le serveur local (flux Server-Sent Events).
// Mode « En direct » par défaut ; le mode « Simulation d'un cycle » reprend la maquette pour la démonstration.
(() => {
"use strict";
const { EQUIPE, creerEtat, appliquer, appliquerLivrables, appliquerCowork } = window.Direct;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MENTION_HUMAIN = "à faire par toi ou par Cowork sur ton accord";
const SANS_NOUVELLES_MS = 30 * 60 * 1000;

// ---------- Dessin des postes (repris de la maquette) ----------
function ecranSVG(type) {
  switch (type) {
    case "barres": return `<g class="anim-barres"><rect x="70" y="52" width="9" height="22" rx="2" fill="#5AA8F2"/><rect x="83" y="52" width="9" height="22" rx="2" fill="#5AA8F2"/><rect x="96" y="52" width="9" height="22" rx="2" fill="#5AA8F2"/><rect x="109" y="52" width="9" height="22" rx="2" fill="#5AA8F2"/></g>`;
    case "lignes": return `<g class="anim-lignes"><rect x="68" y="50" width="52" height="5" rx="2" fill="#A98BF5"/><rect x="68" y="60" width="44" height="5" rx="2" fill="#A98BF5"/><rect x="68" y="70" width="34" height="5" rx="2" fill="#A98BF5"/></g>`;
    case "cube": return `<g class="anim-tourne"><rect x="84" y="50" width="22" height="22" rx="3" fill="none" stroke="#F29A4A" stroke-width="3"/><circle cx="95" cy="61" r="4" fill="#F29A4A"/></g>`;
    case "timeline": return `<rect x="66" y="52" width="56" height="7" rx="2" fill="#F25FA0" opacity=".5"/><rect x="66" y="64" width="38" height="7" rx="2" fill="#3FD0C9" opacity=".6"/><g class="anim-tete"><rect x="68" y="47" width="2.5" height="30" fill="#fff"/></g>`;
    case "onde": return `<g class="anim-barres"><rect x="72" y="54" width="6" height="18" rx="2" fill="#3FD0C9"/><rect x="82" y="54" width="6" height="18" rx="2" fill="#3FD0C9"/><rect x="92" y="54" width="6" height="18" rx="2" fill="#3FD0C9"/><rect x="102" y="54" width="6" height="18" rx="2" fill="#3FD0C9"/></g>`;
    case "coches": return `<path d="M70 56l4 4 7-8M70 70l4 4 7-8" stroke="#6BD58A" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="86" y="54" width="32" height="5" rx="2" fill="#6BD58A" opacity=".6"/><rect x="86" y="68" width="26" height="5" rx="2" fill="#6BD58A" opacity=".6"/>`;
    case "courbe": return `<path d="M68 74 L80 66 L90 70 L102 56 L118 50" stroke="#F2645A" stroke-width="3" fill="none" stroke-linecap="round"/><g class="anim-pulse"><circle cx="118" cy="50" r="3.5" fill="#F2645A"/></g>`;
    case "envoi": return `<g class="anim-pulse"><path d="M80 66 L110 52 L100 74 L95 66 Z" fill="#E8C06E"/></g>`;
  }
  return "";
}
function posteSVG(a) {
  const peau = "#EBCF9F";
  const tete = a.robot
    ? `<rect x="80" y="70" width="30" height="24" rx="7" fill="#C9CFDA"/><circle cx="89" cy="82" r="3" fill="#3FD0C9"/><circle cx="101" cy="82" r="3" fill="#3FD0C9"/><rect x="93" y="62" width="4" height="8" fill="#C9CFDA"/>`
    : `<circle cx="95" cy="82" r="13" fill="${peau}" stroke="rgba(110,78,36,.5)"/><path d="M82 80 Q84 66 95 67 Q107 66 108 80 Q102 73 95 74 Q88 73 82 80Z" fill="${a.cheveux}"/><circle cx="94" cy="84" r="1.6" fill="#2A1E14"/><circle cx="103" cy="84" r="1.6" fill="#2A1E14"/>`;
  return `<svg class="scene" viewBox="0 0 190 150" aria-hidden="true">
    <rect x="38" y="96" width="114" height="10" rx="5" fill="#2A2347"/>
    <rect x="125" y="84" width="8" height="12" fill="#2A2347"/>
    <rect x="92" y="40" width="74" height="44" rx="6" class="ecran-fond"/>
    <g class="contenu" transform="translate(34,0)">${ecranSVG(a.ecran)}</g>
    <g transform="translate(-36,0)"><g class="corps-perso"><rect x="74" y="92" width="42" height="34" rx="12" fill="${a.c}" opacity=".9"/>${tete}</g></g>
    <rect x="22" y="112" width="146" height="14" rx="4" fill="#2C2550"/>
    <rect x="30" y="118" width="40" height="3" rx="1.5" fill="${a.c}" opacity=".7"/><rect x="120" y="118" width="40" height="3" rx="1.5" fill="${a.c}" opacity=".7"/>
    <rect x="30" y="126" width="6" height="18" fill="#221C40"/><rect x="154" y="126" width="6" height="18" fill="#221C40"/>
    <path d="M150 106 q4 -10 10 -6 q-2 6 -10 6z" fill="#5E8C5A"/><rect x="151" y="104" width="10" height="8" rx="2" fill="#7A5C33"/>
  </svg>`;
}
function construire() {
  const r1 = $("r1"), r2 = $("r2"), liste = $("liste");
  EQUIPE.forEach((a, i) => {
    const d = document.createElement("div"); d.className = "poste"; d.id = "poste-" + a.id; d.style.setProperty("--c", a.c);
    d.dataset.etat = "repos";
    d.innerHTML = `<div class="bulle" id="bulle-${a.id}">${esc(a.role)}</div>${posteSVG(a)}<div class="nom">${esc(a.prenom)}</div>`;
    (i < 4 ? r1 : r2).appendChild(d);
    const m = document.createElement("div"); m.className = "membre"; m.id = "membre-" + a.id; m.style.setProperty("--c", a.c);
    m.dataset.etat = "repos";
    m.innerHTML = `<div class="pastille"><svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="10" r="6" fill="${a.robot ? "#C9CFDA" : "#EBCF9F"}"/><rect x="6" y="16" width="14" height="9" rx="4" fill="${a.c}"/></svg></div>
      <div style="min-width:0"><div class="n" title="${esc(a.agent)}">${esc(a.prenom)} <small>${esc(a.role)}<span class="visually-hidden"> (${esc(a.agent)})</span></small></div><div class="st" id="st-${a.id}">au repos</div><div class="barre"><i id="barre-${a.id}"></i></div></div><span class="voyant" title="état"><span class="visually-hidden" id="voyant-${a.id}">au repos</span></span>`;
    liste.appendChild(m);
  });
}

// ---------- Affichage d'un poste ----------
const LIBELLE_ETAT = { actif: "au travail", attend: "attend ta validation", repos: "au repos" };
function afficherPoste(id, s) {
  const a = EQUIPE.find(x => x.id === id);
  ["poste-", "membre-"].forEach(pre => {
    const el = $(pre + id);
    el.classList.toggle("actif", s.e === "actif"); el.classList.toggle("attend", s.e === "attend"); el.dataset.etat = s.e;
  });
  $("bulle-" + id).textContent = s.e === "repos" && s.st === "au repos" ? a.role : s.st;
  $("st-" + id).textContent = s.st || "au repos";
  $("st-" + id).style.color = s.e === "attend" ? "var(--laiton-vif)" : s.e === "repos" ? "var(--doux)" : "";
  $("voyant-" + id).textContent = LIBELLE_ETAT[s.e];
  const barre = $("barre-" + id);
  barre.classList.toggle("indet", s.p === -1);              // progression inconnue : barre animée, pas de pourcentage inventé
  barre.style.width = s.p === -1 ? "" : (s.p || 0) + "%";
}
function majCompteurs(postes) {
  const actifs = EQUIPE.filter(a => postes[a.id] && postes[a.id].e === "actif");
  $("k-actifs").textContent = actifs.length;
  $("en-cours").textContent = actifs.length ? actifs.map(a => a.prenom).join(", ") + " au travail" : "au repos";
}

// ---------- Journal ----------
// Avec un sujet (mode direct), la ligne est une phrase : « <b>Théo</b> lit le brief du studio ».
function journal(qui, texte, heure, sujet) {
  const j = $("journal"), a = EQUIPE.find(x => x.id === qui);
  const d = document.createElement("div"); d.className = "ev"; if (a) d.style.setProperty("--c", a.c);
  const h = (heure || new Date().toLocaleTimeString("fr-FR")).slice(0, 5);
  const style = qui === "toi" ? ' style="color:var(--laiton-vif)"' : a ? "" : ' class="src"';
  const tete = sujet ? `<b${style}>${esc(sujet)}</b> `
    : a ? `<b>${esc(a.prenom)}</b> · ` : (qui === "toi" ? `<b style="color:var(--laiton-vif)">Toi</b> · ` : `<b class="src">Claude Code</b> · `);
  d.innerHTML = `<time>${esc(h)}</time><div>${tete}${esc(texte)}</div>`;
  j.prepend(d); while (j.children.length > 60) j.lastChild.remove();
}
function paquet(de, vers, texte) {
  return new Promise(res => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) return res();
    const a = $("poste-" + de).getBoundingClientRect(), b = $("poste-" + vers).getBoundingClientRect();
    const p = document.createElement("div"); p.className = "paquet"; p.textContent = texte; p.setAttribute("aria-hidden", "true"); document.body.appendChild(p);
    const x0 = a.left + a.width / 2, y0 = a.top + a.height * .35, x1 = b.left + b.width / 2, y1 = b.top + b.height * .35;
    p.style.left = x0 + "px"; p.style.top = y0 + "px"; p.style.transform = "translate(-50%,-50%) scale(.6)";
    requestAnimationFrame(() => requestAnimationFrame(() => { p.style.transform = `translate(calc(-50% + ${x1 - x0}px), calc(-50% + ${y1 - y0}px)) scale(1)`; }));
    setTimeout(() => { p.style.opacity = "0"; setTimeout(() => { p.remove(); res(); }, 300); }, 1150);
  });
}

// =====================================================================
// MODE EN DIRECT
// =====================================================================
let etat = creerEtat();
let source = null;
const activite = {};            // heure (ms) du dernier événement de chaque poste actif

// Âge approximatif d'un événement : le journal ne donne que l'heure (HH:MM:SS), pas la date.
function ageEvenement(heure) {
  const m = /^(\d{2}):(\d{2}):(\d{2})/.exec(heure || "");
  if (!m) return 0;
  const maintenant = new Date(), ev = new Date(maintenant);
  ev.setHours(+m[1], +m[2], +m[3], 0);
  let age = maintenant - ev;
  if (age < -60000) age += 24 * 3600 * 1000;                 // heure « future » : événement de la veille
  return Math.max(0, age);
}
function traiter(ev, anime) {
  const r = appliquer(etat, ev);
  r.changes.forEach(id => {
    afficherPoste(id, etat.postes[id]);
    if (etat.postes[id].e === "actif") activite[id] = Date.now() - ageEvenement(ev.heure);
  });
  if (r.changes.length) majCompteurs(etat.postes);
  if (r.journal) journal(r.journal.qui, r.journal.texte, ev.heure, r.journal.sujet);
  if (r.vol && anime) paquet(r.vol.de, r.vol.vers, r.vol.texte);
}
// Un poste actif sans nouvelles depuis 30 minutes repasse au repos (agent arrêté sans événement de fin).
setInterval(() => {
  if (mode !== "direct") return;
  EQUIPE.forEach(a => {
    if (etat.postes[a.id].e === "actif" && Date.now() - (activite[a.id] || 0) > SANS_NOUVELLES_MS) {
      etat.postes[a.id] = { e: "repos", st: "Sans nouvelles depuis 30 min", p: 0 };
      etat.pile = etat.pile.filter(x => x !== a.agent);
      afficherPoste(a.id, etat.postes[a.id]); majCompteurs(etat.postes);
    }
  });
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
    const liste = JSON.parse(e.data);
    liste.forEach(ev => traiter(ev, false));
    EQUIPE.forEach(a => afficherPoste(a.id, etat.postes[a.id])); majCompteurs(etat.postes);
    document.body.dataset.pret = "oui";
  });
  source.addEventListener("evenement", e => { if (mode === "direct") traiter(JSON.parse(e.data), true); });
}

// ---------- Livrables à valider ----------
let dernierEtat = null;
let enConfirmation = null;     // nom du fichier dont la confirmation est ouverte
function rendreOks(e) {
  const z = $("oks");
  const items = [];
  e.livrables.forEach(l => items.push({ fichier: l.fichier, texte: l.titre, sous: `${l.agent || "agent ?"} · ${l.fichier}` }));
  e.calendrier.lignes.forEach(l => {
    const s = (l.statut || "").toLowerCase();
    if (s === "produit") items.push({ texte: `Publier « ${l.sujet} » (${l.plateforme})`, sous: MENTION_HUMAIN });
    else if (s === "à-valider") items.push({ texte: `Script à valider : « ${l.sujet} » (${l.plateforme})`, sous: "dans marketing/ : " + MENTION_HUMAIN });
  });
  z.innerHTML = items.length ? "" : `<div class="vide">Rien à valider pour l'instant.</div>`;
  items.forEach(o => {
    const d = document.createElement("div"); d.className = "ok-item";
    if (o.fichier) d.dataset.fichier = o.fichier;
    d.innerHTML = `<div style="min-width:0">${esc(o.texte)}<small${o.fichier ? "" : ' class="mention"'}>${esc(o.sous)}</small></div>` +
      (o.fichier ? `<button class="btn" type="button" aria-label="Valider ${esc(o.fichier)}">Valider</button>` : "");
    if (o.fichier) d.querySelector("button").onclick = () => ouvrirConfirmation(d, o);
    z.appendChild(d);
    if (o.fichier === enConfirmation) ouvrirConfirmation(d, o, false);
  });
  $("nb-ok").textContent = items.length;
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
      if (dernierEtat) { dernierEtat.livrables = dernierEtat.livrables.filter(l => l.fichier !== o.fichier); rendreEtat(dernierEtat); }
    } catch (err) {
      msg.className = "message erreur"; msg.textContent = err.message; ev.target.disabled = false;
    }
  };
  if (focus) c.querySelector('[data-action="confirmer"]').focus();
}

// ---------- Calendrier, vidéos, indicateurs ----------
function lundiDeLaSemaine(d) { const l = new Date(d); l.setHours(0, 0, 0, 0); l.setDate(l.getDate() - (l.getDay() + 6) % 7); return l; }
const COULEUR_PLATEFORME = p => /tiktok/i.test(p) ? "#25F4EE" : /reel|insta/i.test(p) ? "#F25FA0" : /short|youtube/i.test(p) ? "#F2645A" : /pinterest/i.test(p) ? "#E8C06E" : "#8D93A6";
function rendreSemaine(creneaux) {
  const s = $("semaine"); s.innerHTML = "";
  const auj = (new Date().getDay() + 6) % 7;
  JOURS.forEach((j, i) => {
    const d = document.createElement("div"); d.className = "jour" + (i === auj ? " auj" : "");
    d.innerHTML = `<h4>${j}${i === auj ? " · auj." : ""}</h4>` + creneaux.filter(c => c.j === i).map(c => `<div class="creneau" style="--c:${c.c}" title="${esc(c.t)}">${esc(c.h)} ${esc(c.t)}</div>`).join("");
    s.appendChild(d);
  });
  $("nb-creneaux").textContent = creneaux.length + (creneaux.length > 1 ? " prévus" : " prévu");
}
function rendreCalendrier(cal) {
  const ids = { tiktok: "p-tiktok", reels: "p-reels", shorts: "p-shorts", pin: "p-pin" };
  if (!cal.source) { Object.values(ids).forEach(id => $(id).textContent = "—"); rendreSemaine([]); $("nb-creneaux").textContent = "calendrier absent"; return; }
  const n = { tiktok: 0, reels: 0, shorts: 0, pin: 0 };
  cal.lignes.forEach(l => {
    if (/tiktok/i.test(l.plateforme)) n.tiktok++;
    if (/reel|insta/i.test(l.plateforme)) n.reels++;
    if (/short|youtube/i.test(l.plateforme)) n.shorts++;
    if (/pinterest/i.test(l.plateforme)) n.pin++;
  });
  Object.keys(ids).forEach(k => $(ids[k]).textContent = n[k]);
  const lundi = lundiDeLaSemaine(new Date()), creneaux = [];
  cal.lignes.forEach(l => {
    const m = /(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}[:h]\d{2}))?/.exec(l.date);
    if (!m) return;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    const ecart = Math.round((d - lundi) / 86400000);
    if (ecart >= 0 && ecart < 7) creneaux.push({ j: ecart, h: m[4] ? m[4].replace("h", ":") : "", t: `${l.sujet} · ${l.plateforme}`, c: COULEUR_PLATEFORME(l.plateforme) });
  });
  rendreSemaine(creneaux);
}
function rendreVideo(v, rapport) {
  $("k-videos").textContent = v.nombre === null ? "—" : v.nombre;
  const vign = $("vign");
  if (!v.derniere) {
    vign.innerHTML = ""; $("titre-video").textContent = "Aucune vidéo"; $("info-video").textContent = "Aucun fichier MP4 dans medias/.";
    $("statut-video").textContent = "aucune"; return;
  }
  const url = "/medias/" + encodeURIComponent(v.derniere.fichier);
  if (vign.dataset.src !== url) {
    vign.dataset.src = url; vign.dataset.duree = "";
    vign.innerHTML = `<video src="${esc(url)}#t=1" preload="metadata" muted playsinline aria-label="Aperçu de ${esc(v.derniere.fichier)}"></video><span>Rendus 3D de démonstration</span>`;
    const video = vign.querySelector("video");
    video.addEventListener("loadedmetadata", () => {
      const d = video.duration, ratio = video.videoWidth && video.videoHeight ? `${video.videoWidth}×${video.videoHeight}` : "";
      vign.dataset.duree = isFinite(d) ? `${d.toFixed(1).replace(".", ",")} s${ratio ? ", " + ratio : ""}` : "durée —";
      $("duree-video").textContent = vign.dataset.duree;
    });
  }
  $("titre-video").textContent = v.derniere.fichier.replace(/\.mp4$/i, "");
  const date = new Date(v.derniere.modifiee).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  $("info-video").innerHTML = `<span id="duree-video">${esc(vign.dataset.duree || "durée —")}</span> · fichier du ${esc(date)}. <a href="${esc(url)}" target="_blank" rel="noopener">Ouvrir le fichier</a>`;
  $("statut-video").textContent = rapport ? `rapport studio-video : ${rapport.statut || "—"}` : "aucun rapport studio-video";
}
function rendreEtat(e) {
  dernierEtat = e;
  const changes = appliquerLivrables(etat, e.livrables);
  changes.forEach(id => afficherPoste(id, etat.postes[id]));
  const cw = appliquerCowork(etat, e.cowork);
  cw.changes.forEach(id => { afficherPoste(id, etat.postes[id]); if (etat.postes[id].e === "actif") activite[id] = Date.now(); });
  if (cw.changes.length) majCompteurs(etat.postes);
  if (cw.journal) journal(cw.journal.qui, cw.journal.texte, undefined, cw.journal.sujet);
  rendreOks(e);
  rendreCalendrier(e.calendrier);
  rendreVideo(e.videos, e.rapportVideo);
  $("k-cout").textContent = e.cout === null ? "—" : e.cout;
  $("k-abonnes").textContent = e.abonnes === null ? "—" : e.abonnes;
  $("src-journal").textContent = e.sources.journal.split(/[\\/]/).pop();
}
function demarrerDirect() {
  etat = creerEtat(); dernierEtat = null; enConfirmation = null;
  $("journal").innerHTML = "";
  EQUIPE.forEach(a => afficherPoste(a.id, etat.postes[a.id])); majCompteurs(etat.postes);
  $("k-videos-s").textContent = "fichiers MP4 dans medias/";
  connecter();
}

// =====================================================================
// MODE SIMULATION (maquette, aucune écriture, aucun appel au serveur)
// =====================================================================
let mode = "direct", jeton = 0, oksSim = [], creneauxSim = [];
const sim = {};
function majAgent(id, e, st, p) { sim[id] = { e, st: st || (e === "repos" ? "au repos" : ""), p: p === undefined ? 0 : p }; afficherPoste(id, sim[id]); majCompteurs(sim); }
const pause = ms => new Promise((res, rej) => { const j = jeton; setTimeout(() => j === jeton ? res() : rej("stop"), ms); });
function rendreOksSim() {
  const z = $("oks");
  z.innerHTML = oksSim.length ? "" : `<div class="vide">Rien à valider pour l'instant.</div>`;
  oksSim.forEach(o => {
    const d = document.createElement("div"); d.className = "ok-item" + (o.pulse ? " pulse" : "");
    d.innerHTML = `<div>${esc(o.texte)}<small${o.bouton === false ? ' class="mention"' : ""}>${esc(o.sous || "")}</small></div>` + (o.bouton === false ? "" : `<button class="btn" type="button">Valider (simulation)</button>`);
    const b = d.querySelector("button"); if (b) b.onclick = () => { oksSim = oksSim.filter(x => x !== o); rendreOksSim(); o.ok && o.ok(); };
    z.appendChild(d);
  });
  $("nb-ok").textContent = oksSim.length; $("k-ok").textContent = oksSim.length;
}
function demander(o) { return new Promise(res => { o.ok = res; oksSim.push(o); rendreOksSim(); }); }
const SUJETS = [
  { titre: "De la planche à l'objet", produit: "boîte à musique", sujets: "son du bois, vue éclatée, cadeau" },
  { titre: "Trois cames, un voilier", produit: "automate à manivelle", sujets: "objets qui bougent, ASMR mécanique, Noël" }
];
let tour = 0, videosSim = 0;
async function progression(id, texte, de, a, ms) { const pas = 8; for (let i = 1; i <= pas; i++) { majAgent(id, "actif", texte, Math.round(de + (a - de) * i / pas)); await pause(ms / pas); } }
async function cycle() {
  const S = SUJETS[tour % SUJETS.length]; tour++;
  $("titre-video").textContent = S.titre; $("statut-video").textContent = "en préparation (simulation)";
  $("info-video").textContent = `${S.produit} · rendus 3D de démonstration (simulation).`;
  journal(null, `Simulation : nouveau cycle « ${S.titre} »`);
  await progression("veille", "Repère les tendances", 0, 100, 3200);
  journal("veille", `3 pistes de la semaine : ${S.sujets}.`);
  majAgent("veille", "repos", "Tendances livrées", 100);
  await paquet("veille", "script", "3 pistes");
  await progression("script", "Écrit le script", 0, 100, 3600);
  journal("script", "Script prêt. Il attend ta validation.");
  majAgent("script", "attend", "Attend ta validation", 100);
  await demander({ texte: `Valider le script « ${S.titre} »`, sous: "createur-contenu · simulation, aucun fichier modifié", pulse: true });
  journal("toi", "Script validé (simulation).");
  majAgent("script", "repos", "Script validé", 100);
  await paquet("script", "visuels", "script validé");
  await progression("visuels", "Rend l'orbite et la vue éclatée", 0, 100, 3600);
  journal("visuels", "Plans 3D rendus, mention « Rendus 3D de démonstration ».");
  majAgent("visuels", "repos", "Plans livrés", 100);
  await paquet("visuels", "montage", "plans 3D");
  majAgent("montage", "actif", "Monte les plans", 10);
  await pause(1200);
  await progression("voix", "Voix et sous-titres en local", 0, 100, 2800);
  journal("voix", "Voix générée en local, sous-titres minutés.");
  majAgent("voix", "repos", "Voix livrée", 100);
  await paquet("voix", "montage", "voix + sous-titres");
  await progression("montage", "Montage, sous-titres, bruitages", 20, 100, 4200);
  journal("montage", "Vidéo rendue en 9:16.");
  majAgent("montage", "repos", "Vidéo rendue", 100);
  await paquet("montage", "controle", "vidéo 9:16");
  await progression("controle", "Vérifie mentions, droits, crédits", 0, 100, 3000);
  journal("controle", "Conforme : mention de démonstration visible, licences notées.");
  majAgent("controle", "repos", "Conforme", 100);
  videosSim++; $("k-videos").textContent = videosSim;
  $("statut-video").textContent = "prête (simulation)";
  majAgent("pub", "attend", "Attend ton accord pour publier", 0);
  const publier = { texte: `Publier « ${S.titre} » sur TikTok et Reels`, sous: MENTION_HUMAIN, bouton: false };
  oksSim.push(publier); rendreOksSim();
  await pause(5000);
  oksSim = oksSim.filter(o => o !== publier); rendreOksSim();
  journal("toi", "Accord donné (simulation : rien n'est publié).");
  await progression("pub", "Programme TikTok et Reels", 0, 100, 2400);
  const j = ((new Date().getDay() + 6) % 7 + tour) % 7;
  creneauxSim.push({ j, h: "", t: S.titre, c: "#25F4EE" }, { j: (j + 1) % 7, h: "", t: S.titre, c: "#F25FA0" }); rendreSemaine(creneauxSim);
  ["p-tiktok", "p-reels"].forEach(id => { const el = $(id); el.textContent = (+el.textContent || 0) + 1; });
  journal("pub", "Programmée (simulation, rien n'est publié).");
  majAgent("pub", "repos", "Programmée", 100);
  await paquet("pub", "pubs", "vidéo");
  await progression("pubs", "Prépare une pub en pause", 0, 100, 2600);
  journal("pubs", "Pub préparée en pause (simulation).");
  majAgent("pubs", "attend", "Pub en pause, à toi d'activer", 100);
  oksSim.push({ texte: `Activer la pub « ${S.titre} »`, sous: MENTION_HUMAIN, bouton: false }); rendreOksSim();
  await pause(4000);
  majAgent("pubs", "repos", "Pub en pause", 100);
  oksSim = oksSim.filter(o => o.bouton !== false); rendreOksSim();
  await pause(1500);
  EQUIPE.forEach(a => majAgent(a.id, "repos", "au repos", 0));
  return cycle();
}
function demarrerSimulation() {
  if (source) { source.close(); source = null; }
  lien("simulation", "");
  jeton++; oksSim = []; creneauxSim = []; videosSim = 0; rendreOksSim(); rendreSemaine([]);
  $("journal").innerHTML = ""; $("src-journal").textContent = "simulation";
  $("k-videos").textContent = "0"; $("k-videos-s").textContent = "dans cette simulation";
  ["p-tiktok", "p-reels", "p-shorts", "p-pin"].forEach(id => $(id).textContent = "0");
  EQUIPE.forEach(a => majAgent(a.id, "repos", "au repos", 0));
  cycle().catch(() => {});
}

// ---------- Boutons de mode ----------
const bR = $("m-reel"), bS = $("m-sim");
bR.onclick = () => { if (mode === "direct") return; mode = "direct"; jeton++; bR.setAttribute("aria-pressed", "true"); bS.setAttribute("aria-pressed", "false"); demarrerDirect(); };
bS.onclick = () => { if (mode === "simulation") return; mode = "simulation"; bS.setAttribute("aria-pressed", "true"); bR.setAttribute("aria-pressed", "false"); demarrerSimulation(); };

construire(); rendreSemaine([]);
demarrerDirect();
})();
