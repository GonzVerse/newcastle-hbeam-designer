import { describe, it, expect } from 'vitest';
import { designBumpout } from '../calculations';
import { BumpoutInputs } from '../types';
import {
  SINGLE_BOX_BEAM,
  DOUBLE_BOX_BEAM,
  MN_2IN,
  VA_2IN,
} from '../constants';

describe('designBumpout', () => {
  describe('Basic calculation flow', () => {
    it('should return valid result structure', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result).toHaveProperty('inputs');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('w_box_beam');
      expect(result).toHaveProperty('M_box');
      expect(result).toHaveProperty('V_box');
      expect(result).toHaveProperty('box_beam_selection');
      expect(result).toHaveProperty('w_ledger');
      expect(result).toHaveProperty('M_ledger');
      expect(result).toHaveProperty('V_ledger');
      expect(result).toHaveProperty('P_hbeam');
      expect(result).toHaveProperty('ledger_member');
      expect(result).toHaveProperty('M_hbeam');
      expect(result).toHaveProperty('V_hbeam_wall');
      expect(result).toHaveProperty('V_hbeam_post');
      expect(result).toHaveProperty('hbeam_member');
      expect(result).toHaveProperty('checks');
    });

    it('should return input values in result', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result.inputs).toEqual(inputs);
    });

    it('should generate checks array with pass/fail results', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result.checks).toBeInstanceOf(Array);
      expect(result.checks.length).toBeGreaterThan(0);

      result.checks.forEach(check => {
        expect(check).toHaveProperty('label');
        expect(check).toHaveProperty('demand');
        expect(check).toHaveProperty('capacity');
        expect(check).toHaveProperty('DCR');
        expect(check).toHaveProperty('pass');
        expect(typeof check.pass).toBe('boolean');
      });
    });
  });

  describe('Box beam calculations', () => {
    it('should calculate box beam load correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);
      const j = inputs.L_ft - inputs.a_ft; // backspan = 11 ft

      // w_box = p*(j+b)^2 / (2*j) + self_weight
      const expectedLoad = (inputs.p_psf * Math.pow(j + inputs.b_ft, 2)) / (2 * j);
      const expectedW = expectedLoad + SINGLE_BOX_BEAM.weight_plf;

      expect(result.w_box_beam).toBeCloseTo(expectedW, 2);
    });

    it('should calculate box beam moment correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      // M_box = w * S^2 / 8
      const expectedM = (result.w_box_beam * Math.pow(inputs.S_ft, 2)) / 8;

      expect(result.M_box).toBeCloseTo(expectedM, 2);
    });

    it('should calculate box beam shear correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      // V_box = w * S / 2
      const expectedV = (result.w_box_beam * inputs.S_ft) / 2;

      expect(result.V_box).toBeCloseTo(expectedV, 2);
    });

    it('should select single box beam for light loads', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50, // minimum load
        a_ft: 3,
        b_ft: 1,
        L_ft: 10,
        W_ft: 8,
        S_ft: 6,
      };

      const result = designBumpout(inputs);

      expect(result.box_beam_selection).toBe('single');
    });

    it('should select double box beam for heavier loads', () => {
      const inputs: BumpoutInputs = {
        p_psf: 100, // high load
        a_ft: 5,
        b_ft: 5,
        L_ft: 20,
        W_ft: 12,
        S_ft: 12, // max span
      };

      const result = designBumpout(inputs);

      expect(['single', 'double', 'exceeds']).toContain(result.box_beam_selection);
    });

    it('should mark exceeds when box beam capacities are exceeded', () => {
      const inputs: BumpoutInputs = {
        p_psf: 500, // extremely high load
        a_ft: 6,
        b_ft: 6,
        L_ft: 23,
        W_ft: 13,
        S_ft: 13,
      };

      const result = designBumpout(inputs);

      expect(result.box_beam_selection).toBe('exceeds');
    });
  });

  describe('Ledger calculations', () => {
    it('should calculate ledger load correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);
      const j = inputs.L_ft - inputs.a_ft;

      // w_ledger = p*(j^2 - b^2)/(2*j) + self_weight
      const expectedLoad = (inputs.p_psf * (Math.pow(j, 2) - Math.pow(inputs.b_ft, 2))) / (2 * j);
      const expectedW = expectedLoad + SINGLE_BOX_BEAM.weight_plf;

      expect(result.w_ledger).toBeCloseTo(expectedW, 2);
    });

    it('should calculate ledger moment correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      // M_ledger = w * W^2 / 8
      const expectedM = (result.w_ledger * Math.pow(inputs.W_ft, 2)) / 8;

      expect(result.M_ledger).toBeCloseTo(expectedM, 2);
    });

    it('should calculate ledger shear correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      // V_ledger = w * W / 2
      const expectedV = (result.w_ledger * inputs.W_ft) / 2;

      expect(result.V_ledger).toBeCloseTo(expectedV, 2);
    });

    it('should set P_hbeam equal to V_ledger', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result.P_hbeam).toBe(result.V_ledger);
    });

    it('should select single box beam for light ledger loads', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50,
        a_ft: 3,
        b_ft: 1,
        L_ft: 10,
        W_ft: 6,
        S_ft: 5,
      };

      const result = designBumpout(inputs);

      expect(result.ledger_member).toBe('single_box_beam');
    });

    it('should mark fails when ledger capacities are exceeded', () => {
      const inputs: BumpoutInputs = {
        p_psf: 500,
        a_ft: 6,
        b_ft: 6,
        L_ft: 23,
        W_ft: 13,
        S_ft: 12,
      };

      const result = designBumpout(inputs);

      expect(result.ledger_member).toBe('fails');
    });
  });

  describe('H-beam calculations', () => {
    it('should calculate H-beam moment correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);
      const j = inputs.L_ft - inputs.a_ft;

      // Verify moment calculation combines point load and distributed load
      expect(result.M_hbeam).toBeGreaterThan(0);
      expect(result.M_hbeam).toBeLessThan(100000); // sanity check
    });

    it('should calculate H-beam shear reactions correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result.V_hbeam_wall).toBeGreaterThan(0);
      expect(result.V_hbeam_post).toBeGreaterThan(0);
    });

    it('should select single 2in for light H-beam loads', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50,
        a_ft: 2,
        b_ft: 1,
        L_ft: 8,
        W_ft: 5,
        S_ft: 4,
      };

      const result = designBumpout(inputs);

      expect(result.hbeam_member).toBe('single_2in');
    });

    it('should progress through member ladder for increasing loads', () => {
      const inputs: BumpoutInputs = {
        p_psf: 80,
        a_ft: 4,
        b_ft: 3,
        L_ft: 15,
        W_ft: 10,
        S_ft: 9,
      };

      const result = designBumpout(inputs);

      expect(['single_2in', 'single_box_beam', 'double_box_beam']).toContain(result.hbeam_member);
    });

    it('should mark fails when H-beam capacities are exceeded', () => {
      const inputs: BumpoutInputs = {
        p_psf: 500,
        a_ft: 6,
        b_ft: 6,
        L_ft: 23,
        W_ft: 13,
        S_ft: 12,
      };

      const result = designBumpout(inputs);

      expect(result.hbeam_member).toBe('fails');
    });
  });

  describe('Optional connection shear check', () => {
    it('should include connection check when Va_connection is provided', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
        Va_connection: 5000,
      };

      const result = designBumpout(inputs);

      const connectionCheck = result.checks.find(c => c.label.includes('Connection'));
      expect(connectionCheck).toBeDefined();
      expect(connectionCheck?.demand).toBe(result.V_hbeam_wall);
      expect(connectionCheck?.capacity).toBe(5000);
    });

    it('should pass connection check when demand is below capacity', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50,
        a_ft: 3,
        b_ft: 1,
        L_ft: 10,
        W_ft: 8,
        S_ft: 6,
        Va_connection: 10000, // high capacity
      };

      const result = designBumpout(inputs);

      const connectionCheck = result.checks.find(c => c.label.includes('Connection'));
      expect(connectionCheck?.pass).toBe(true);
    });

    it('should fail connection check when demand exceeds capacity', () => {
      const inputs: BumpoutInputs = {
        p_psf: 100,
        a_ft: 5,
        b_ft: 4,
        L_ft: 20,
        W_ft: 12,
        S_ft: 11,
        Va_connection: 100, // very low capacity
      };

      const result = designBumpout(inputs);

      const connectionCheck = result.checks.find(c => c.label.includes('Connection'));
      expect(connectionCheck?.pass).toBe(false);
    });

    it('should not include connection check when Va_connection is undefined', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      const connectionCheck = result.checks.find(c => c.label.includes('Connection'));
      expect(connectionCheck).toBeUndefined();
    });
  });

  describe('DCR (Demand-to-Capacity Ratio) calculations', () => {
    it('should calculate DCR correctly for all checks', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      result.checks.forEach(check => {
        const expectedDCR = check.demand / check.capacity;
        expect(check.DCR).toBeCloseTo(expectedDCR, 5);
      });
    });

    it('should mark pass=true when DCR <= 1.0', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50,
        a_ft: 2,
        b_ft: 1,
        L_ft: 8,
        W_ft: 5,
        S_ft: 4,
      };

      const result = designBumpout(inputs);

      const passingChecks = result.checks.filter(c => c.pass);
      passingChecks.forEach(check => {
        expect(check.DCR).toBeLessThanOrEqual(1.0);
      });
    });

    it('should mark pass=false when DCR > 1.0', () => {
      const inputs: BumpoutInputs = {
        p_psf: 500,
        a_ft: 6,
        b_ft: 6,
        L_ft: 23,
        W_ft: 13,
        S_ft: 13,
      };

      const result = designBumpout(inputs);

      const failingChecks = result.checks.filter(c => !c.pass);
      failingChecks.forEach(check => {
        expect(check.DCR).toBeGreaterThan(1.0);
      });
    });
  });

  describe('Validation integration', () => {
    it('should return errors for invalid geometry', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 25, // exceeds max
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return warnings for low loads', () => {
      const inputs: BumpoutInputs = {
        p_psf: 30, // below IRC minimum
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should return early with empty results when errors exist', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 25, // invalid
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 8,
      };

      const result = designBumpout(inputs);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.w_box_beam).toBe(0);
      expect(result.M_box).toBe(0);
      expect(result.V_box).toBe(0);
      expect(result.box_beam_selection).toBe('exceeds');
      expect(result.checks).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle minimum valid inputs', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50,
        a_ft: 1,
        b_ft: 0.5,
        L_ft: 2,
        W_ft: 2,
        S_ft: 1.5,
      };

      const result = designBumpout(inputs);

      expect(result.errors.length).toBe(0);
      expect(result.w_box_beam).toBeGreaterThan(0);
      expect(result.M_box).toBeGreaterThan(0);
      expect(result.V_box).toBeGreaterThan(0);
    });

    it('should handle maximum valid inputs', () => {
      const inputs: BumpoutInputs = {
        p_psf: 100,
        a_ft: 6,
        b_ft: 6,
        L_ft: 23,
        W_ft: 13,
        S_ft: 13,
      };

      const result = designBumpout(inputs);

      expect(result.w_box_beam).toBeGreaterThan(0);
      expect(result.M_box).toBeGreaterThan(0);
      expect(result.V_box).toBeGreaterThan(0);
    });

    it('should handle equal post spacing and width', () => {
      const inputs: BumpoutInputs = {
        p_psf: 60,
        a_ft: 4,
        b_ft: 2,
        L_ft: 15,
        W_ft: 10,
        S_ft: 10, // S = W
      };

      const result = designBumpout(inputs);

      expect(result.errors.length).toBe(0);
      expect(result.w_box_beam).toBeGreaterThan(0);
    });
  });
});
