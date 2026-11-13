// « Trouver ma maquette » sur l'accueil (§4.1.7). Fonctionne avec ou sans animation.
// Les réponses sont des liens vers les pages statiques ; ce script les intercepte et tout se passe
// dans la section. Aucun cookie, aucun localStorage, aucune requête : les données sont dans la page.
import {
  cheminEtape,
  libelleChoix,
  recommander,
  type Experience,
  type PourQui,
  type ProduitQuiz,
  type Temps,
} from '../lib/questionnaire';

type Etat = { pourQui?: PourQui; experience?: Experience };
const QUESTIONS = ['pourQui', 'experience', 'temps'] as const;

export function initialiserQuestionnaire(): void {
  const racine = document.querySelector<HTMLElement>('[data-questionnaire]');
  const source = racine?.querySelector('script[data-produits]');
  if (!racine || !source || racine.dataset.pret) return;
  racine.dataset.pret = '1';

  const { produits, messageCadeau } = JSON.parse(source.textContent || '{}') as { produits: ProduitQuiz[]; messageCadeau: boolean };
  const zone = racine.querySelector<HTMLElement>('[data-zone]')!;
  const annonce = racine.querySelector<HTMLElement>('[data-annonce]')!;
  const retour = racine.querySelector<HTMLButtonElement>('[data-retour]')!;
  const texteProgression = racine.querySelector<HTMLElement>('[data-progression-texte]')!;
  const segments = [...racine.querySelectorAll<HTMLElement>('[data-segment]')];
  const modele = (nom: string) => racine.querySelector<HTMLTemplateElement>(`template[data-modele="${nom}"]`)!.content.cloneNode(true) as DocumentFragment;
  const anime = () => document.documentElement.classList.contains('js-anim') && !document.documentElement.classList.contains('anim-pause');

  let etat: Etat = {};
  let etape = 0; // 0, 1, 2 = questions ; 3 = résultats

  function progression(n: number) {
    texteProgression.textContent = n <= 2 ? `Question ${n + 1} sur 3` : 'Vos suggestions';
    segments.forEach((s, i) => {
      s.classList.toggle('scale-x-100', i < n);
      s.classList.toggle('scale-x-0', i >= n);
    });
    retour.hidden = n === 0;
  }

  /** Remplace le contenu de la zone, avec un glissement de 24 px si l'animation est permise. */
  function afficher(contenu: DocumentFragment | HTMLElement, sens: 1 | -1) {
    const entrer = () => {
      zone.replaceChildren(contenu);
      if (anime()) zone.animate([{ transform: `translateX(${24 * sens}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
    };
    if (!anime()) return entrer();
    zone.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-24 * sens}px)`, opacity: 0 }], { duration: 200, easing: 'ease-in' }).finished.then(entrer, entrer);
  }

  /** Met à jour les liens d'une question (version partageable) selon les réponses déjà données. */
  function relier(fragment: DocumentFragment, question: (typeof QUESTIONS)[number]) {
    fragment.querySelectorAll<HTMLAnchorElement>('a[data-choix]').forEach((a) => {
      const v = a.dataset.choix!;
      a.href =
        question === 'pourQui' ? cheminEtape(v as PourQui) : question === 'experience' ? cheminEtape(etat.pourQui, v as Experience) : cheminEtape(etat.pourQui, etat.experience, v as Temps);
    });
    return fragment;
  }

  function question(n: 0 | 1 | 2, sens: 1 | -1 = 1) {
    etape = n;
    const nom = QUESTIONS[n];
    const fragment = n === 0 ? relier(modeleQuestion1(), 'pourQui') : relier(modele(nom), nom);
    afficher(fragment, sens);
    progression(n);
    annonce.textContent = `Question ${n + 1} sur 3`;
    requestAnimationFrame(() => zone.querySelector<HTMLElement>('legend')?.focus({ preventScroll: true }));
  }

  // La question 1 est dans la page dès le départ (version sans JavaScript) : on la garde comme modèle.
  const question1 = zone.firstElementChild!.cloneNode(true) as HTMLElement;
  const modeleQuestion1 = () => {
    const f = document.createDocumentFragment();
    f.append(question1.cloneNode(true));
    return f;
  };

  function resultats(temps: Temps) {
    etape = 3;
    const { pourQui, experience } = etat as Required<Etat>;
    const { resultats: liste, message } = recommander(produits, pourQui, experience, temps);
    const bloc = modele('resultats');
    const n = liste.length;
    bloc.querySelector('[data-titre]')!.innerHTML = `${n} maquette${n > 1 ? 's' : ''} <em>pour commencer.</em>`;
    bloc.querySelector('[data-reponses]')!.textContent =
      `Vos réponses : ${libelleChoix('pourQui', pourQui)} · ${libelleChoix('experience', experience)} · ${libelleChoix('temps', temps)}`;
    if (message) {
      const m = bloc.querySelector<HTMLElement>('[data-message]')!;
      m.hidden = false;
      m.querySelector('span')!.textContent = message;
    }
    if (pourQui === 'offrir') {
      const o = bloc.querySelector<HTMLElement>('[data-offrir]')!;
      o.hidden = false;
      o.querySelector('span')!.textContent = `À offrir : ${messageCadeau ? 'message cadeau possible au paiement · ' : ''}droit de rétractation de 14 jours à compter de la réception.`;
    }
    const ul = bloc.querySelector('[data-liste]')!;
    for (const r of liste) {
      const carte = modele('carte');
      const p = r.produit;
      const lien = carte.querySelector<HTMLAnchorElement>('[data-lien]')!;
      lien.href = `/maquettes/${p.slug}/`;
      lien.setAttribute('aria-label', `Voir la maquette ${p.nom}`);
      const img = carte.querySelector<HTMLImageElement>('[data-image]')!;
      img.src = p.image;
      img.alt = p.alt;
      carte.querySelector('[data-nom]')!.textContent = p.nom;
      carte.querySelector('[data-temps]')!.textContent = `${p.hMin === p.hMax ? p.hMax : `${p.hMin} à ${p.hMax}`} h · niveau ${p.niveau}`;
      carte.querySelector('[data-prix]')!.textContent = p.prix;
      if (p.demo) {
        carte.querySelector<HTMLElement>('[data-demo]')!.hidden = false;
        carte.querySelector<HTMLElement>('[data-prix-demo]')!.hidden = false;
      }
      const raisons = carte.querySelector('[data-raisons]')!;
      for (const raison of r.raisons) {
        const li = document.createElement('li');
        li.className = 'rounded-full border border-bordure bg-papier px-3 py-1 text-[13px] font-medium';
        li.textContent = raison;
        raisons.append(li);
      }
      ul.append(carte);
    }
    bloc.querySelector<HTMLAnchorElement>('[data-lien-resultat]')!.href = cheminEtape(pourQui, experience, temps);
    bloc.querySelector('[data-recommencer]')!.addEventListener('click', () => {
      etat = {};
      question(0, -1);
    });
    afficher(bloc, 1);
    progression(3);
    annonce.textContent = `${n} maquette${n > 1 ? 's' : ''} trouvée${n > 1 ? 's' : ''}`;
    requestAnimationFrame(() => {
      zone.querySelector<HTMLElement>('[data-titre]')?.focus({ preventScroll: true });
      if (anime()) {
        zone.querySelectorAll('[data-liste] > li').forEach((li, i) =>
          li.animate([{ transform: 'translateY(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], {
            duration: 600,
            delay: 200 + i * 80,
            easing: 'cubic-bezier(.22,1,.36,1)',
            fill: 'backwards',
          }),
        );
      }
    });
  }

  function choisir(lien: HTMLAnchorElement) {
    const fieldset = lien.closest<HTMLElement>('[data-question]');
    if (!fieldset) return;
    const nom = fieldset.dataset.question as (typeof QUESTIONS)[number];
    const v = lien.dataset.choix!;
    fieldset.querySelectorAll('.tuile').forEach((t) => t.classList.remove('choisie'));
    lien.classList.add('choisie');
    const suite = () => {
      if (nom === 'pourQui') {
        etat = { pourQui: v as PourQui };
        question(1);
      } else if (nom === 'experience') {
        etat.experience = v as Experience;
        question(2);
      } else resultats(v as Temps);
    };
    // La coche apparaît (200 ms) avant le passage à la question suivante.
    if (anime()) setTimeout(suite, 220);
    else suite();
  }

  racine.addEventListener('click', (e) => {
    const lien = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-choix]');
    if (!lien || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    choisir(lien);
  });
  // Espace active aussi une tuile (Entrée est natif sur un lien).
  racine.addEventListener('keydown', (e) => {
    const lien = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-choix]');
    if (lien && e.key === ' ') {
      e.preventDefault();
      choisir(lien);
    }
  });
  retour.addEventListener('click', () => {
    if (etape === 3) question(2, -1);
    else if (etape === 2) question(1, -1);
    else if (etape === 1) {
      etat = {};
      question(0, -1);
    }
  });

  // Lien « Trouver une maquette à offrir » de la section Offrir : questionnaire préréglé, dans la page.
  document.querySelectorAll<HTMLAnchorElement>('a[data-questionnaire-offrir]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      etat = { pourQui: 'offrir' };
      question(1);
      document.getElementById('trouver-ma-maquette')?.scrollIntoView({ behavior: anime() ? 'smooth' : 'auto', block: 'start' });
    }),
  );
}
