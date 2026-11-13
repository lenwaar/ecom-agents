// Configuration Astro de la boutique Rouage & Laiton.
// Site 100 % statique : aucun adaptateur serveur à cette étape.
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Toutes les URL de la spécification se terminent par « / ».
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Pas de barre d'outils de développement : elle ajoute des scripts en local.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
