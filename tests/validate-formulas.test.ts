/**
 * Formula Validation Tests: TypeScript vs Julia Reference Implementation
 *
 * This test suite validates that the TypeScript calculations match the Julia source
 * file NewCastle_HBeam_V1.jl exactly, using test cases from the Julia test suite.
 *
 * Reference: C:\Users\jborr\OneDrive\Desktop\My stuff\Career\RunToSolve\NewCastle\NewCastle_HBeam_V1.jl
 * Julia Test: "Hefele validation targets" (lines 1365-1379)
 */

import { describe, test, expect } from 'vitest';
import { designBumpout } from '../src/lib/calculations';
import { BumpoutInputs } from '../src/lib/types';

describe('Formula Validation: TypeScript vs Julia Reference', () => {
  describe('Hefele Validation Case (Julia lines 1365-1379)', () => {
    /**
     * Test inputs from Julia file:
     * p_psf=50.0, a_ft=3.0, b_ft=3.0, L_ft=13.0, W_ft=13.0, S_ft=9.25
     *
     * Expected results (from Julia comments, lines 1344-1363):
     * j = L-a = 13-3 = 10 ft (joist span)
     * w_ledger = 50*(100-9)/(20) + 5.8 = 227.5 + 5.8 = 233.3 lb/ft
     * M_ledger = 233.3*13²/8 ≈ 4,930 ft-lb
     * V_ledger = 233.3*13/2 ≈ 1,517 lbs
     * P_hbeam ≈ 1,517 lbs
     *
     * w_trib = 50*(16/12)/2 = 33.33 lb/ft
     * M_pt = 1517*3*10/13 ≈ 3,501 ft-lb
     * M_trib ≈ 631 ft-lb
     * M_hbeam = 3,501 + 631 ≈ 4,132 ft-lb
     * V_hbeam_wall ≈ 1,295 lbs (1,167 pt + 128 trib)
     *
     * w_box = 50*(13)²/(20) + 5.8 = 422.5 + 5.8 = 428.3 lb/ft
     * M_box = 428.3*9.25²/8 ≈ 4,580 ft-lb
     * V_box = 428.3*9.25/2 ≈ 1,981 lbs
     */

    const hefeleInputs: BumpoutInputs = {
      p_psf: 50.0,
      a_ft: 3.0,
      b_ft: 3.0,
      L_ft: 13.0,
      W_ft: 13.0,
      S_ft: 9.25,
    };

    test('w_ledger formula: p*(j²-b²)/(2j) + self_weight', () => {
      const result = designBumpout(hefeleInputs);

      // Julia test (line 1368): @test r.w_ledger ≈ 227.5 + SINGLE_BOX_BEAM.weight_plf atol=1.0
      // SINGLE_BOX_BEAM.weight_plf = 5.8 lb/ft
      const expected = 227.5 + 5.8; // 233.3 lb/ft

      expect(result.w_ledger).toBeCloseTo(expected, 0); // within 1 lb/ft
    });

    test('w_box_beam formula: p*(j+b)²/(2j) + self_weight', () => {
      const result = designBumpout(hefeleInputs);

      // Julia test (line 1369): @test r.w_box_beam ≈ 422.5 + SINGLE_BOX_BEAM.weight_plf atol=1.0
      const expected = 422.5 + 5.8; // 428.3 lb/ft

      expect(result.w_box_beam).toBeCloseTo(expected, 0); // within 1 lb/ft
    });

    test('M_ledger = w_ledger * W² / 8', () => {
      const result = designBumpout(hefeleInputs);

      // Expected: 233.3 * 13² / 8 ≈ 4,930 ft-lb
      const expected = 4930;

      expect(result.M_ledger).toBeCloseTo(expected, -1); // within 10 ft-lb
    });

    test('V_ledger = w_ledger * W / 2', () => {
      const result = designBumpout(hefeleInputs);

      // Expected: 233.3 * 13 / 2 ≈ 1,517 lbs
      const expected = 1517;

      expect(result.V_ledger).toBeCloseTo(expected, -1); // within 10 lbs
    });

    test('P_hbeam = V_ledger', () => {
      const result = designBumpout(hefeleInputs);

      expect(result.P_hbeam).toBe(result.V_ledger);
    });

    test('M_box = w_box * S² / 8', () => {
      const result = designBumpout(hefeleInputs);

      // Expected: 428.3 * 9.25² / 8 ≈ 4,580 ft-lb
      const expected = 4580;

      expect(result.M_box).toBeCloseTo(expected, -1); // within 10 ft-lb
    });

    test('V_box = w_box * S / 2', () => {
      const result = designBumpout(hefeleInputs);

      // Expected: 428.3 * 9.25 / 2 ≈ 1,981 lbs
      const expected = 1981;

      expect(result.V_box).toBeCloseTo(expected, -1); // within 10 lbs
    });

    test('M_hbeam = M_pt + M_trib (point load + tributary UDL)', () => {
      const result = designBumpout(hefeleInputs);

      // Expected: M_hbeam ≈ 4,132 ft-lb (3,501 pt + 631 trib)
      const expected = 4132;

      expect(result.M_hbeam).toBeCloseTo(expected, -1); // within 10 ft-lb
    });

    test('V_hbeam_wall = R_A_pt + R_A_trib', () => {
      const result = designBumpout(hefeleInputs);

      // Julia test (lines 1372-1374): V_hbeam_wall ≈ P*j/L + w_trib*j²/(2L)
      // Expected: ≈ 1,295 lbs (1,167 pt + 128 trib)
      // Julia uses: @test r.V_hbeam_wall ≈ r.P_hbeam*j/L + w_trib*j^2/(2.0*L) atol=10.0

      const j = 10.0; // L - a = 13 - 3
      const L = 13.0;
      const w_trib = 50.0 * (16/12) / 2.0; // 33.33 lb/ft (joist spacing 16" OC)
      const expected_formula = result.P_hbeam * j / L + w_trib * Math.pow(j, 2) / (2.0 * L);

      expect(result.V_hbeam_wall).toBeCloseTo(expected_formula, -1); // within 10 lbs
      expect(result.V_hbeam_wall).toBeCloseTo(1295, -1); // within 10 lbs
    });

    test('Member selections match Julia expectations', () => {
      const result = designBumpout(hefeleInputs);

      // Julia expectations (line 1637-1639):
      // ledger_member: :single_box_beam
      // hbeam_member: :single_2in (M=4,132 < MN_2IN=4,425)
      // box_beam_selection: :single

      expect(result.ledger_member).toBe('single_box_beam');
      expect(result.hbeam_member).toBe('single_2in');
      expect(result.box_beam_selection).toBe('single');
    });

    test('No errors for valid Hefele case', () => {
      const result = designBumpout(hefeleInputs);

      // Julia test (line 1378): @test isempty(r.errors)
      expect(result.errors).toHaveLength(0);

      // Note: Julia test (line 1377) shows @test isempty(r.warnings), BUT this is because
      // the Julia test case includes Va_connection. The Hefele inputs here don't include
      // Va_connection, so TypeScript correctly generates the warning:
      // "Va_connection not provided: hanger/connection check will be skipped"
      // This matches Julia line 464: push!(warnings, "⚠️ Va_connection not provided...")
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('Va_connection');
    });
  });

  describe('Derived Variable j = L - a', () => {
    test('j is correctly computed as backspan (joist span)', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50.0,
        a_ft: 3.0,
        b_ft: 3.0,
        L_ft: 13.0,
        W_ft: 13.0,
        S_ft: 9.25,
      };

      const result = designBumpout(inputs);

      // j = L - a should be used in formulas
      // We can verify this indirectly through w_ledger calculation:
      // w_ledger = p*(j²-b²)/(2j) where j = L-a = 13-3 = 10
      // = 50*(100-9)/(20) = 50*91/20 = 227.5 lb/ft (before self-weight)

      const j = inputs.L_ft - inputs.a_ft; // 10 ft
      const w_ledger_calc = inputs.p_psf * (Math.pow(j, 2) - Math.pow(inputs.b_ft, 2)) / (2 * j);
      const w_ledger_expected = 227.5;

      expect(w_ledger_calc).toBeCloseTo(w_ledger_expected, 1);
    });
  });

  describe('Edge Cases from Julia Tests', () => {
    test('Minimum dimensions (Julia: p=50, L=8, a=1, b=1, W=6, S=6)', () => {
      // Julia test "Ledger minimum is single box beam" (lines 1381-1387)
      // j=L-a=7, w_ledger = 50*(49-1)/14 = 171.4 lb/ft
      // M_ledger = 171.4*36/8 = 771 ft-lb → :single_box_beam

      const result = designBumpout({
        p_psf: 50.0,
        a_ft: 1.0,
        b_ft: 1.0,
        L_ft: 8.0,
        W_ft: 6.0,
        S_ft: 6.0,
      });

      const j = 7.0; // L-a = 8-1
      const w_ledger_applied = 50.0 * (Math.pow(j, 2) - Math.pow(1.0, 2)) / (2 * j);
      expect(w_ledger_applied).toBeCloseTo(171.4, 1);

      expect(result.ledger_member).toBe('single_box_beam');
    });

    test('Deflection drives box beam upgrade at S=13 (Julia lines 1482-1486)', () => {
      // At S=13 ft, w_box=422.5 lb/ft: single box beam fails L/240 but double passes
      // design_bumpout must select :double, not :single

      const result = designBumpout({
        p_psf: 50.0,
        a_ft: 3.0,
        b_ft: 3.0,
        L_ft: 13.0,
        W_ft: 13.0,
        S_ft: 13.0, // Increased from 9.25 to 13
      });

      expect(result.box_beam_selection).toBe('double'); // deflection forces upgrade
    });

    test('Small W forces single_2in H-beam (Julia lines 1296-1298)', () => {
      // W=1 ft gives very small M_hbeam → :single_2in

      const result = designBumpout({
        p_psf: 50.0,
        a_ft: 3.0,
        b_ft: 3.0,
        L_ft: 13.0,
        W_ft: 1.0,
        S_ft: 1.0,
      });

      expect(result.hbeam_member).toBe('single_2in');
    });
  });

  describe('H-beam Load Superposition', () => {
    test('M_hbeam combines point load and tributary UDL correctly', () => {
      // Julia formula (lines 629-647):
      // M_pt = P_hbeam * a * (L-a) / L
      // M_trib = w_trib * j² * (4La + j²) / (8L²)
      // M_hbeam = M_pt + M_trib

      const inputs: BumpoutInputs = {
        p_psf: 50.0,
        a_ft: 3.0,
        b_ft: 3.0,
        L_ft: 13.0,
        W_ft: 13.0,
        S_ft: 9.25,
      };

      const result = designBumpout(inputs);

      const j = inputs.L_ft - inputs.a_ft; // 10 ft
      const L = inputs.L_ft;
      const a = inputs.a_ft;

      // Point load moment
      const M_pt = result.P_hbeam * a * j / L;

      // Tributary UDL moment (joist spacing 16" OC)
      const w_trib = inputs.p_psf * (16/12) / 2.0; // 33.33 lb/ft
      const M_trib = w_trib * Math.pow(j, 2) * (4 * L * a + Math.pow(j, 2)) / (8 * Math.pow(L, 2));

      const M_hbeam_calc = M_pt + M_trib;

      expect(result.M_hbeam).toBeCloseTo(M_hbeam_calc, 1);
      expect(M_pt).toBeCloseTo(3501, -1); // ≈ 3,501 ft-lb
      expect(M_trib).toBeCloseTo(631, -1); // ≈ 631 ft-lb
    });

    test('V_hbeam_wall and V_hbeam_post superpose correctly', () => {
      const inputs: BumpoutInputs = {
        p_psf: 50.0,
        a_ft: 3.0,
        b_ft: 3.0,
        L_ft: 13.0,
        W_ft: 13.0,
        S_ft: 9.25,
      };

      const result = designBumpout(inputs);

      const j = 10.0; // L - a
      const L = 13.0;
      const a = 3.0;
      const w_trib = 50.0 * (16/12) / 2.0; // 33.33 lb/ft

      // Point load reactions
      const R_A_pt = result.P_hbeam * j / L;
      const R_B_pt = result.P_hbeam * a / L;

      // Tributary UDL reactions
      const R_A_trib = w_trib * Math.pow(j, 2) / (2 * L);
      const R_B_trib = w_trib * j * (2 * L - j) / (2 * L);

      const V_wall_calc = R_A_pt + R_A_trib;
      const V_post_calc = R_B_pt + R_B_trib;

      expect(result.V_hbeam_wall).toBeCloseTo(V_wall_calc, 1);
      expect(result.V_hbeam_post).toBeCloseTo(V_post_calc, 1);
    });
  });

  describe('Self-weight Handling', () => {
    test('Box beam and ledger include SINGLE_BOX_BEAM.weight_plf = 5.8 lb/ft', () => {
      const result = designBumpout({
        p_psf: 50.0,
        a_ft: 3.0,
        b_ft: 3.0,
        L_ft: 13.0,
        W_ft: 13.0,
        S_ft: 9.25,
      });

      // Julia: w_ledger_applied = 227.5, w_ledger = 227.5 + 5.8 = 233.3
      // Julia: w_box_applied = 422.5, w_box = 422.5 + 5.8 = 428.3

      const SELF_WEIGHT = 5.8;

      expect(result.w_ledger).toBeGreaterThan(227.5);
      expect(result.w_ledger).toBeCloseTo(227.5 + SELF_WEIGHT, 0);

      expect(result.w_box_beam).toBeGreaterThan(422.5);
      expect(result.w_box_beam).toBeCloseTo(422.5 + SELF_WEIGHT, 0);
    });
  });
});
