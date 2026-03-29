import { designBumpout } from './src/lib/calculations.ts';

const result = designBumpout({
  p_psf: 50.0,
  a_ft: 3.0,
  b_ft: 3.0,
  L_ft: 13.0,
  W_ft: 13.0,
  S_ft: 9.25,
});

console.log('Warnings:', JSON.stringify(result.warnings, null, 2));
console.log('Errors:', JSON.stringify(result.errors, null, 2));
