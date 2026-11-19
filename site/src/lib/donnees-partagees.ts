// Lecture du dossier data/ à la racine du dépôt (partagé entre le site et le QG), au moment de la construction.
// `npm run build` se lance depuis site/ : on remonte depuis le dossier courant jusqu'à trouver data/produits/.
// Variable d'environnement facultative : BOUTIQUE_DATA (chemin du dossier data/).
import fs from 'node:fs';
import path from 'node:path';
import { erreursProduit, type ProduitModele } from './produit-modele';
import { avisDuProduit, type ResultatAvis } from './avis';

let dossierTrouve: string | null = null;

export function dossierData(): string {
  if (dossierTrouve) return dossierTrouve;
  const impose = process.env.BOUTIQUE_DATA;
  if (impose) return (dossierTrouve = path.resolve(impose));
  let dossier = process.cwd();
  for (;;) {
    const candidat = path.join(dossier, 'data');
    if (fs.existsSync(path.join(candidat, 'produits'))) return (dossierTrouve = candidat);
    const parent = path.dirname(dossier);
    if (parent === dossier) throw new Error(`Dossier data/produits/ introuvable en remontant depuis ${process.cwd()} (ou BOUTIQUE_DATA).`);
    dossier = parent;
  }
}

function lireJson(fichier: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(fichier, 'utf8'));
  } catch (err) {
    throw new Error(`${path.relative(process.cwd(), fichier)} : JSON illisible (${(err as Error).message}).`);
  }
}

/** Tous les produits de data/produits/, validés. Une seule erreur fait échouer la construction. */
export function produitsModele(): ProduitModele[] {
  const dossier = path.join(dossierData(), 'produits');
  const fichiers = fs.readdirSync(dossier).filter((f) => f.endsWith('.json')).sort();
  const erreurs: string[] = [];
  const produits: ProduitModele[] = [];
  for (const fichier of fichiers) {
    const brut = lireJson(path.join(dossier, fichier));
    const e = erreursProduit(brut, fichier);
    if (e.length) erreurs.push(...e);
    else produits.push(brut as ProduitModele);
  }
  if (erreurs.length) throw new Error(`Produits invalides dans data/produits/ :\n- ${erreurs.join('\n- ')}`);
  return produits;
}

/** Avis affichables d'un produit ; les avis écartés sont signalés en console pendant la construction. */
export function avisAffichables(slug: string, demo: boolean): ResultatAvis {
  const fichier = path.join(dossierData(), 'avis.json');
  const tous = fs.existsSync(fichier) ? lireJson(fichier) : [];
  const resultat = avisDuProduit(tous, slug, demo);
  for (const { index, raison } of resultat.ignores) console.warn(`[avis] data/avis.json[${index}] (${slug}) ignoré : ${raison}.`);
  return resultat;
}
