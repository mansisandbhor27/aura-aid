// Copies the Compact compiler's output (contract/managed/{keys,zkir})
// into public/{keys,zkir} so Vite can actually serve them at runtime.
// Vite only serves files under public/ at the site root; it does not
// serve arbitrary project directories like contract/managed/ directly.
//
// Run this after recompiling the contract, before `npm run build`.
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const pairs = [
  ['contract/managed/keys', 'public/keys'],
  ['contract/managed/zkir', 'public/zkir'],
];

for (const [src, dest] of pairs) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    if (name.endsWith('.prover') || name.endsWith('.verifier') || name.endsWith('.bzkir')) {
      copyFileSync(join(src, name), join(dest, name));
      console.log(`Copied ${join(src, name)} -> ${join(dest, name)}`);
    }
  }
}
