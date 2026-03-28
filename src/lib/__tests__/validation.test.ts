import { describe, it, expect } from 'vitest';
import { validateInputs } from '../validation';
import { BumpoutInputs } from '../types';

describe('validateInputs', () => {
  describe('Valid inputs', () => {
    it('should return no errors or warnings for valid inputs', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
        Va_connection: 5000,
      };

      const result = validateInputs(inputs);

      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it('should return no errors for maximum valid dimensions', () => {
      const inputs: BumpoutInputs = {
        p_psf: 100,
        a_ft: 6,
        b_ft: 6,
        L_ft: 23,
        W_ft: 13,
        S_ft: 13,
        Va_connection: 5000,
      };

      const result = validateInputs(inputs);

      expect(result.errors).toEqual([]);
    });

    it('should return no errors for minimum valid dimensions', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50,
        a_ft: 1,
        b_ft: 0.5,
        L_ft: 2,
        W_ft: 2,
        S_ft: 1.5,
        Va_connection: 1000,
      };

      const result = validateInputs(inputs);

      expect(result.errors).toEqual([]);
    });
  });

  describe('Hard limit errors', () => {
    it('should error when L_ft exceeds 23 ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 25,
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('L_ft');
      expect(result.errors[0]).toContain('23');
    });

    it('should error when a_ft exceeds 6 ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 7,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('a_ft');
      expect(result.errors[0]).toContain('6');
    });

    it('should error when b_ft exceeds 6 ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 7,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('b_ft');
      expect(result.errors[0]).toContain('6');
    });

    it('should error when W_ft exceeds 13 ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 15,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('W_ft');
      expect(result.errors[0]).toContain('13');
    });

    it('should error when S_ft exceeds 13 ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 15,
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('S_ft');
      expect(result.errors[0]).toContain('13');
    });

    it('should error when S_ft exceeds W_ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 8,
        S_ft: 10,
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('S_ft');
      expect(result.errors[0]).toContain('W_ft');
      expect(result.errors[0]).toContain('posts must be inside');
    });
  });

  describe('Backspan rule', () => {
    it('should error when backspan j < b_ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 5,
        b_ft: 5,
        L_ft: 8, // j = 8 - 5 = 3, which is < 5
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      const backspanError = result.errors.find(e => e.includes('Backspan'));
      expect(backspanError).toBeDefined();
      expect(backspanError).toContain('j');
    });

    it('should pass when backspan j = b_ft (edge case)', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 5,
        b_ft: 2,
        L_ft: 7, // j = 7 - 5 = 2
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.errors).toEqual([]);
    });

    it('should pass when backspan j > b_ft', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15, // j = 15 - 4 = 11 > 2
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.errors).toEqual([]);
    });
  });

  describe('Warnings', () => {
    it('should warn when p_psf is below 50 PSF', () => {
      const inputs: BumpoutInputs = {
        p_psf: 40,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
        Va_connection: 5000,
      };

      const result = validateInputs(inputs);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('p_psf');
      expect(result.warnings[0]).toContain('50');
    });

    it('should not warn when p_psf is exactly 50 PSF', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
        Va_connection: 5000,
      };

      const result = validateInputs(inputs);

      const lowLoadWarning = result.warnings.find(w => w.includes('p_psf'));
      expect(lowLoadWarning).toBeUndefined();
    });

    it('should warn when Va_connection is undefined', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Va_connection');
      expect(result.warnings[0]).toContain('not provided');
    });

    it('should not warn when Va_connection is provided', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
        Va_connection: 5000,
      };

      const result = validateInputs(inputs);

      const connectionWarning = result.warnings.find(w => w.includes('Va_connection'));
      expect(connectionWarning).toBeUndefined();
    });
  });

  describe('Multiple errors and warnings', () => {
    it('should accumulate multiple errors', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 10, // exceeds 6
        b_ft: 8,  // exceeds 6
        L_ft: 30, // exceeds 23
        W_ft: 15, // exceeds 13
        S_ft: 20, // exceeds 13 and W_ft
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });

    it('should have both errors and warnings', () => {
      const inputs: BumpoutInputs = {
        p_psf: 40, // warning
        a_ft: 10,  // error
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
        // Va_connection undefined - warning
      };

      const result = validateInputs(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Return type', () => {
    it('should always return an object with errors and warnings arrays', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = validateInputs(inputs);

      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });
});
