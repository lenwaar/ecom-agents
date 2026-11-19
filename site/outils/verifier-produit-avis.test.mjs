// Tests des règles des produits modèles et des avis (node --test, Node 22.18+ : lit le TypeScript directement).
// Lancer : `npm test` dans site/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { avisDuProduit, noteMoyenne, raisonRejet } from '../src/lib/avis.ts';
import { erreursProduit } from '../src/lib/produit-modele.ts';

const demo = JSON.parse(readFileSync(new URL('../../data/produits/exemple-demo.json', import.meta.url), 'utf8'));
const copie = (o) => structuredClone(o);

const avisValide = { reference_commande: 'CMD-0001', produit: 'vrai', note: 4, texte: 'Clair et pratique.', date: '2026-11-02', auteur: 'Marie L.' };

test('le produit de démonstration fourni est valide', () => {
  assert.deepEqual(erreursProduit(demo, 'exemple-demo.json'), []);
});

test('démonstration : paiement actif ou url de paiement refusés', () => {
  const a = copie(demo);
  a.paiement.actif = true;
  assert.match(erreursProduit(a, 'exemple-demo.json').join(), /paiement\.actif/);
  const b = copie(demo);
  b.paiement.url = 'https://exemple.invalid/paiement';
  assert.match(erreursProduit(b, 'exemple-demo.json').join(), /paiement\.url/);
});

// Produit physique de test : toutes les valeurs à null (aucun chiffre ni fabricant inventé).
const coord = () => ({ nom: null, adresse: null, contact: null });
const physique = () => ({
  ...copie(demo),
  type: 'physique',
  format: 'sans objet',
  frais_port_ttc: null,
  age_minimum: null,
  gpsr: { fabricant: coord(), personne_responsable_ue: coord(), avertissements: null, reference: null },
});

test('le produit de démonstration fourni est numérique, port, âge et GPSR « sans objet »', () => {
  assert.equal(demo.type, 'numerique');
  assert.equal(demo.frais_port_ttc, 'sans objet');
  assert.equal(demo.age_minimum, 'sans objet');
  assert.equal(demo.gpsr, 'sans objet');
});

test('type absent ou inconnu refusé', () => {
  const p = copie(demo);
  delete p.type;
  assert.match(erreursProduit(p, 'exemple-demo.json').join(), /type/);
});

test('numérique : port, âge ou GPSR renseignés refusés', () => {
  const p = copie(demo);
  p.age_minimum = 14;
  p.gpsr = physique().gpsr;
  const e = erreursProduit(p, 'exemple-demo.json').join('\n');
  assert.match(e, /numérique : age_minimum/);
  assert.match(e, /numérique : gpsr/);
});

test('numérique vendu : prix, accès et format obligatoires, pas de GPSR exigé', () => {
  const p = copie(demo);
  p.demo = false;
  const e = erreursProduit(p, 'exemple-demo.json').join('\n');
  assert.match(e, /prix_ttc/);
  assert.match(e, /delai/);
  assert.match(e, /format/);
  assert.doesNotMatch(e, /gpsr|age_minimum|frais_port/);
  assert.match(e, /paiement\.url/);
});

test('physique vendu : champ obligatoire à null ou paiement absent refusés', () => {
  const p = physique();
  p.demo = false;
  const e = erreursProduit(p, 'exemple-demo.json').join('\n');
  assert.match(e, /prix_ttc/);
  assert.match(e, /age_minimum/);
  assert.match(e, /gpsr\.fabricant\.nom/);
  assert.match(e, /paiement\.url/);
});

test('physique : âge ou GPSR « sans objet » refusés', () => {
  const p = physique();
  p.age_minimum = 'sans objet';
  p.gpsr = 'sans objet';
  const e = erreursProduit(p, 'exemple-demo.json').join('\n');
  assert.match(e, /physique : age_minimum/);
  assert.match(e, /physique : gpsr/);
  assert.deepEqual(erreursProduit(physique(), 'exemple-demo.json'), []);
});

test('slug différent du nom de fichier refusé', () => {
  assert.match(erreursProduit(demo, 'autre.json').join(), /nom du fichier/);
});

test('avis valide affiché, autres produits filtrés', () => {
  const r = avisDuProduit([avisValide, { ...avisValide, produit: 'autre' }], 'vrai', false);
  assert.equal(r.valides.length, 1);
  assert.equal(r.ignores.length, 0);
});

test('références de commande non réelles ignorées', () => {
  for (const ref of ['', '  ', 'exemple', 'DEMO-1', 'Démo', 'test-42']) {
    assert.ok(raisonRejet({ ...avisValide, reference_commande: ref }), ref);
  }
  assert.ok(raisonRejet({ ...avisValide, reference_commande: undefined }));
});

test('note, date et auteur contrôlés', () => {
  assert.ok(raisonRejet({ ...avisValide, note: 4.5 }));
  assert.ok(raisonRejet({ ...avisValide, note: 0 }));
  assert.ok(raisonRejet({ ...avisValide, note: 6 }));
  assert.ok(raisonRejet({ ...avisValide, date: '02/11/2026' }));
  assert.ok(raisonRejet({ ...avisValide, date: '2026-02-30' }));
  assert.ok(raisonRejet({ ...avisValide, auteur: 'Marie Dupont' }));
  assert.ok(raisonRejet({ ...avisValide, texte: '' }));
  for (const auteur of ['Marie', 'M.', 'Marie L.', 'Jean-Luc']) assert.equal(raisonRejet({ ...avisValide, auteur }), null, auteur);
});

test('produit de démonstration : aucun avis, même valide', () => {
  const r = avisDuProduit([{ ...avisValide, produit: 'exemple-demo' }], 'exemple-demo', true);
  assert.equal(r.valides.length, 0);
  assert.equal(r.ignores.length, 1);
});

test('pas de note moyenne sans avis', () => {
  assert.equal(noteMoyenne([]), null);
  assert.equal(noteMoyenne([avisValide, { ...avisValide, note: 5 }]), 4.5);
});

test('fichier avis qui n\'est pas une liste : rien affiché', () => {
  assert.equal(avisDuProduit({}, 'vrai', false).valides.length, 0);
});
