// Page Modules du QG : lit /api/modules et affiche chaque module avec son badge « actif » ou « à venir ».
"use strict";
(function () {
  const $ = id => document.getElementById(id);
  fetch("/api/modules", { cache: "no-store" }).then(r => r.json()).then(d => {
    $("message").textContent = d.message || "";
    $("message").classList.toggle("erreur", d.etat !== "ok");
    const actifs = d.modules.filter(m => m.statut === "actif").length;
    $("nb-modules").textContent = d.modules.length ? `${actifs} actif(s) sur ${d.modules.length}` : "—";
    $("modules").replaceChildren(...d.modules.map(m => {
      const li = document.createElement("li"); li.className = "module"; li.dataset.id = m.id;
      const h = document.createElement("h2"); h.textContent = m.nom;
      const b = document.createElement("span");
      b.className = "badge " + (m.statut === "actif" ? "actif" : "a-venir");
      b.textContent = m.statut === "actif" ? "actif" : "à venir";
      h.append(b);
      const p = document.createElement("p"); p.textContent = m.description;
      li.append(h, p); return li;
    }));
    document.body.dataset.pret = "oui";
  }).catch(() => {
    $("message").textContent = "Impossible de lire /api/modules : le serveur du QG est-il lancé ?";
    $("message").classList.add("erreur");
    document.body.dataset.pret = "oui";
  });
})();
