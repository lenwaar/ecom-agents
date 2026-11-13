// Liens de navigation et du pied de page (§4.0 de la spécification v2).
// Une seule source pour la barre, le panneau mobile et le pied de page.
// `existe: false` = page prévue à une étape suivante (catalogue, collections, questionnaire, atelier).

export interface Lien {
  libelle: string;
  href: string;
  existe: boolean;
}

export const LIENS_NAVIGATION: Lien[] = [
  { libelle: 'Maquettes', href: '/maquettes/', existe: false },
  { libelle: 'Idées cadeaux', href: '/collections/idees-cadeaux/', existe: false },
  { libelle: "L'atelier", href: '/atelier/', existe: false },
  { libelle: 'Aide', href: '/faq/', existe: true },
];

/** Liens ajoutés dans le panneau mobile. */
export const LIENS_PANNEAU_MOBILE: Lien[] = [
  { libelle: 'Trouver ma maquette', href: '/trouver-ma-maquette/', existe: false },
  { libelle: 'Livraison et retours', href: '/livraison-et-retours/', existe: true },
  { libelle: 'Contact', href: '/contact/', existe: true },
];

export const COLONNES_PIED_DE_PAGE: { titre: string; liens: Lien[] }[] = [
  {
    titre: 'Boutique',
    liens: [
      { libelle: 'Maquettes', href: '/maquettes/', existe: false },
      { libelle: 'Collections', href: '/collections/mecanique/', existe: false },
      { libelle: 'Trouver ma maquette', href: '/trouver-ma-maquette/', existe: false },
      { libelle: "L'atelier", href: '/atelier/', existe: false },
      { libelle: 'À propos', href: '/a-propos/', existe: true },
    ],
  },
  {
    titre: 'Aide',
    liens: [
      { libelle: 'Livraison et retours', href: '/livraison-et-retours/', existe: true },
      { libelle: 'FAQ', href: '/faq/', existe: true },
      { libelle: 'Contact', href: '/contact/', existe: true },
      { libelle: 'Pièce manquante', href: '/contact/#piece-manquante', existe: true },
      { libelle: 'Renoncer au contrat ici', href: '/renoncer-au-contrat/', existe: true },
    ],
  },
  {
    titre: 'Informations légales',
    liens: [
      { libelle: 'Mentions légales', href: '/mentions-legales/', existe: true },
      { libelle: 'CGV', href: '/cgv/', existe: true },
      { libelle: 'Confidentialité', href: '/confidentialite/', existe: true },
      { libelle: 'Cookies', href: '/cookies/', existe: true },
    ],
  },
];
