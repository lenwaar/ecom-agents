// Page Boutique du QG : lit /api/boutique et affiche les chiffres réels, et à part les commandes d'exemple.
"use strict";
(function () {
  const eur = v => v === null || v === undefined ? "—" : v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const $ = id => document.getElementById(id);

  function carte(etiquette, valeur, sous, classe) {
    const d = document.createElement("div"); d.className = "kpi";
    const e = document.createElement("div"); e.className = "etiq"; e.textContent = etiquette;
    const v = document.createElement("div"); v.className = "v" + (classe ? " " + classe : ""); v.textContent = valeur;
    const s = document.createElement("div"); s.className = "s"; s.textContent = sous;
    d.append(e, v, s); return d;
  }
  function cartes(cible, t, visiteurs) {
    const vide = t.commandes === 0;
    const ton = v => v === null ? "vide" : (v < 0 ? "negatif" : "");
    cible.replaceChildren(
      carte("Ventes (CA TTC)", eur(t.ca_ttc), vide ? "Aucune commande" : `${t.payees} commande(s) payée(s)`),
      carte("Commandes", String(t.commandes), vide ? "Aucune commande" : `${t.payees} payée(s), ${t.remboursements.nombre} remboursée(s)`),
      carte("Panier moyen", eur(t.panier_moyen), t.panier_moyen === null ? "Aucune commande payée" : "CA TTC ÷ commandes payées", ton(t.panier_moyen)),
      carte("Remboursements", String(t.remboursements.nombre), `${eur(t.remboursements.montant)} remboursé(s)`),
      ...(visiteurs ? [carte("Visiteurs", "—", visiteurs.note, "vide")] : []),
      carte("Marge nette réelle", eur(t.marge_nette_totale), "totale, après frais, cotisations et provision", vide ? "vide" : ton(t.marge_nette_totale)),
      carte("Marge par commande", eur(t.marge_par_commande), t.marge_par_commande === null ? "Aucune commande" : "marge totale ÷ commandes", ton(t.marge_par_commande))
    );
  }
  function liste(cible, lignes) {
    cible.replaceChildren(...lignes.map(l => { const li = document.createElement("li"); li.textContent = l; return li; }));
  }

  fetch("/api/boutique", { cache: "no-store" }).then(r => r.json()).then(d => {
    const msg = $("message");
    msg.textContent = d.message || "";
    msg.classList.toggle("erreur", d.etat === "absent" || d.etat === "invalide");
    $("source").textContent = d.etat === "ok" ? `source : ${d.source}${d.importe_le ? ", importé le " + d.importe_le : ""}` : d.fichier;
    cartes($("reel"), d.reel, d.visiteurs);
    $("bloc-exemple").hidden = !d.exemple;
    if (d.exemple) cartes($("exemple"), d.exemple, null);
    $("bloc-avert").hidden = !(d.avertissements && d.avertissements.length);
    liste($("avertissements"), d.avertissements || []);
    liste($("hypotheses"), d.hypotheses || []);
    document.body.dataset.pret = "oui";
  }).catch(() => {
    $("message").textContent = "Impossible de lire /api/boutique : le serveur du QG est-il lancé ?";
    $("message").classList.add("erreur");
    document.body.dataset.pret = "oui";
  });
})();
