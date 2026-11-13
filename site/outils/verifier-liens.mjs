// Lance tools/verifier_liens.py après la construction (script « postbuild » de package.json).
// Interpréteur : `py` (Windows), sinon `python3`, sinon `python`. Si aucun n'est installé
// (par exemple sur une machine de construction sans Python), la vérification est sautée avec
// un avertissement ; VERIFIER_LIENS_OBLIGATOIRE=1 transforme ce saut en échec.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../tools/verifier_liens.py', import.meta.url));
const dist = fileURLToPath(new URL('../dist/', import.meta.url));

for (const interpreteur of ['py', 'python3', 'python']) {
  const r = spawnSync(interpreteur, [script, dist], { stdio: 'inherit' });
  if (r.error && r.error.code === 'ENOENT') continue;
  if (r.error) throw r.error;
  process.exit(r.status ?? 1);
}

console.warn('Vérification des liens sautée : Python introuvable (py, python3, python).');
process.exit(process.env.VERIFIER_LIENS_OBLIGATOIRE === '1' ? 1 : 0);
