import { BumpoutInputs } from './types';

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validateInputs(inputs: BumpoutInputs): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { p_psf, a_ft, b_ft, L_ft, W_ft, S_ft, Va_connection } = inputs;

  // Hard limit checks
  if (L_ft > 23) {
    errors.push(`L_ft (${L_ft}) exceeds maximum allowable span of 23 ft`);
  }
  if (a_ft > 6) {
    errors.push(`a_ft (${a_ft}) exceeds maximum bumpout depth of 6 ft`);
  }
  if (b_ft > 6) {
    errors.push(`b_ft (${b_ft}) exceeds maximum cantilever overhang of 6 ft`);
  }
  if (W_ft > 13) {
    errors.push(`W_ft (${W_ft}) exceeds maximum bumpout width of 13 ft`);
  }
  if (S_ft > 13) {
    errors.push(`S_ft (${S_ft}) exceeds maximum post spacing of 13 ft`);
  }
  if (S_ft > W_ft) {
    errors.push(`S_ft (${S_ft}) exceeds W_ft (${W_ft}): posts must be inside H-beam lines`);
  }

  // Backspan rule: j = L - a must be >= b
  const j = L_ft - a_ft;
  if (j < b_ft) {
    errors.push(
      `Backspan j = L - a = ${j.toFixed(2)} ft is less than b_ft (${b_ft} ft). ` +
      `Increase L or decrease a/b.`
    );
  }

  // Warnings
  if (p_psf < 50) {
    warnings.push(`p_psf (${p_psf}) is below the IRC 2021 minimum of 50 PSF`);
  }
  if (Va_connection === undefined) {
    warnings.push('Va_connection not provided: hanger/connection shear check will be skipped');
  }

  return { errors, warnings };
}
