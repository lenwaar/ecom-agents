// Configuration Astro de la boutique Rouage & Laiton.
// Site 100 % statique : aucun adaptateur serveur à cette étape.
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  // Toutes les URL de la spécification se terminent par « / ».
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Pas de barre d'outils de développement : elle ajoute des scripts en local.
  devToolbar: { enabled: false },
  // React : seulement pour les 4 îlots animés de src/components/animes/ (V2-2), tous en client:visible.
  integrations: [react({ include: ['**/components/animes/**'] })],
  vite: {
    plugins: [tailwindcss()],
  },
});
