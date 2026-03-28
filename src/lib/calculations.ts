import {
  BumpoutInputs,
  BumpoutDesignResult,
  CheckResult,
  MemberSelection,
} from './types';
import {
  SINGLE_BOX_BEAM,
  DOUBLE_BOX_BEAM,
  MN_2IN,
  VA_2IN,
  E_CFS_PSI,
  JOIST_SPACING_FT,
} from './constants';
import { validateInputs } from './validation';

/**
 * Compute midspan deflection for a simply-supported uniformly loaded beam.
 * w_plf: load in plf, L_ft: span in ft, EI: E*I in lb·in²
 * Returns deflection in inches.
 */
function deflectionSimpleUDL(w_plf: number, L_ft: number, EI: number): number {
  const w = w_plf / 12; // convert plf → lb/in
  const L = L_ft * 12;  // ft → in
  return (5 * w * Math.pow(L, 4)) / (384 * EI);
}

/**
 * Select box beam based on moment, shear, and optional deflection check.
 * Returns the member selection string.
 */
function selectBoxBeam(
  M_demand: number,
  V_demand: number,
  w_plf: number,
  span_ft: number,
  checks: CheckResult[]
): MemberSelection {
  const deflLimit = (span_ft * 12) / 240; // L/240 in inches

  // Check single
  const singleEI = E_CFS_PSI * SINGLE_BOX_BEAM.Ix;
  const deflSingle = deflectionSimpleUDL(w_plf, span_ft, singleEI);
  const singleMPass = M_demand <= SINGLE_BOX_BEAM.Mal;
  const singleVPass = V_demand <= SINGLE_BOX_BEAM.Va;
  const singleDPass = deflSingle <= deflLimit;

  checks.push({
    label: 'Box Beam (single) – Moment',
    demand: M_demand,
    capacity: SINGLE_BOX_BEAM.Mal,
    DCR: M_demand / SINGLE_BOX_BEAM.Mal,
    pass: singleMPass,
  });
  checks.push({
    label: 'Box Beam (single) – Shear',
    demand: V_demand,
    capacity: SINGLE_BOX_BEAM.Va,
    DCR: V_demand / SINGLE_BOX_BEAM.Va,
    pass: singleVPass,
  });
  checks.push({
    label: 'Box Beam (single) – Deflection (L/240)',
    demand: deflSingle,
    capacity: deflLimit,
    DCR: deflSingle / deflLimit,
    pass: singleDPass,
  });

  if (singleMPass && singleVPass && singleDPass) return 'single';

  // Check double
  const doubleEI = E_CFS_PSI * DOUBLE_BOX_BEAM.Ix;
  const deflDouble = deflectionSimpleUDL(w_plf, span_ft, doubleEI);
  const doubleMPass = M_demand <= DOUBLE_BOX_BEAM.Mal;
  const doubleVPass = V_demand <= DOUBLE_BOX_BEAM.Va;
  const doubleDPass = deflDouble <= deflLimit;

  checks.push({
    label: 'Box Beam (double) – Moment',
    demand: M_demand,
    capacity: DOUBLE_BOX_BEAM.Mal,
    DCR: M_demand / DOUBLE_BOX_BEAM.Mal,
    pass: doubleMPass,
  });
  checks.push({
    label: 'Box Beam (double) – Shear',
    demand: V_demand,
    capacity: DOUBLE_BOX_BEAM.Va,
    DCR: V_demand / DOUBLE_BOX_BEAM.Va,
    pass: doubleVPass,
  });
  checks.push({
    label: 'Box Beam (double) – Deflection (L/240)',
    demand: deflDouble,
    capacity: deflLimit,
    DCR: deflDouble / deflLimit,
    pass: doubleDPass,
  });

  if (doubleMPass && doubleVPass && doubleDPass) return 'double';

  return 'exceeds';
}

/**
 * Select ledger member based on moment and shear demands.
 */
function selectLedger(
  M_demand: number,
  V_demand: number,
  w_plf: number,
  span_ft: number,
  checks: CheckResult[]
): MemberSelection {
  const deflLimit = (span_ft * 12) / 240;

  // Try single box beam
  const singleEI = E_CFS_PSI * SINGLE_BOX_BEAM.Ix;
  const deflSingle = deflectionSimpleUDL(w_plf, span_ft, singleEI);
  const sMPass = M_demand <= SINGLE_BOX_BEAM.Mal;
  const sVPass = V_demand <= SINGLE_BOX_BEAM.Va;
  const sDPass = deflSingle <= deflLimit;

  checks.push({
    label: 'Ledger (single box beam) – Moment',
    demand: M_demand,
    capacity: SINGLE_BOX_BEAM.Mal,
    DCR: M_demand / SINGLE_BOX_BEAM.Mal,
    pass: sMPass,
  });
  checks.push({
    label: 'Ledger (single box beam) – Shear',
    demand: V_demand,
    capacity: SINGLE_BOX_BEAM.Va,
    DCR: V_demand / SINGLE_BOX_BEAM.Va,
    pass: sVPass,
  });
  checks.push({
    label: 'Ledger (single box beam) – Deflection (L/240)',
    demand: deflSingle,
    capacity: deflLimit,
    DCR: deflSingle / deflLimit,
    pass: sDPass,
  });

  if (sMPass && sVPass && sDPass) return 'single_box_beam';

  // Try double box beam
  const doubleEI = E_CFS_PSI * DOUBLE_BOX_BEAM.Ix;
  const deflDouble = deflectionSimpleUDL(w_plf, span_ft, doubleEI);
  const dMPass = M_demand <= DOUBLE_BOX_BEAM.Mal;
  const dVPass = V_demand <= DOUBLE_BOX_BEAM.Va;
  const dDPass = deflDouble <= deflLimit;

  checks.push({
    label: 'Ledger (double box beam) – Moment',
    demand: M_demand,
    capacity: DOUBLE_BOX_BEAM.Mal,
    DCR: M_demand / DOUBLE_BOX_BEAM.Mal,
    pass: dMPass,
  });
  checks.push({
    label: 'Ledger (double box beam) – Shear',
    demand: V_demand,
    capacity: DOUBLE_BOX_BEAM.Va,
    DCR: V_demand / DOUBLE_BOX_BEAM.Va,
    pass: dVPass,
  });
  checks.push({
    label: 'Ledger (double box beam) – Deflection (L/240)',
    demand: deflDouble,
    capacity: deflLimit,
    DCR: deflDouble / deflLimit,
    pass: dDPass,
  });

  if (dMPass && dVPass && dDPass) return 'double_box_beam';

  return 'fails';
}

/**
 * Select H-beam member based on moment and shear demands.
 * Ladder: single_2in → single_box_beam → double_box_beam → fails
 */
function selectHbeam(
  M_demand: number,
  V_demand: number,
  checks: CheckResult[]
): MemberSelection {
  // Try single 2in
  const s2MPass = M_demand <= MN_2IN;
  const s2VPass = V_demand <= VA_2IN;

  checks.push({
    label: 'H-Beam (single 2in) – Moment',
    demand: M_demand,
    capacity: MN_2IN,
    DCR: M_demand / MN_2IN,
    pass: s2MPass,
  });
  checks.push({
    label: 'H-Beam (single 2in) – Shear',
    demand: V_demand,
    capacity: VA_2IN,
    DCR: V_demand / VA_2IN,
    pass: s2VPass,
  });

  if (s2MPass && s2VPass) return 'single_2in';

  // Try single box beam
  const sMPass = M_demand <= SINGLE_BOX_BEAM.Mal;
  const sVPass = V_demand <= SINGLE_BOX_BEAM.Va;

  checks.push({
    label: 'H-Beam (single box beam) – Moment',
    demand: M_demand,
    capacity: SINGLE_BOX_BEAM.Mal,
    DCR: M_demand / SINGLE_BOX_BEAM.Mal,
    pass: sMPass,
  });
  checks.push({
    label: 'H-Beam (single box beam) – Shear',
    demand: V_demand,
    capacity: SINGLE_BOX_BEAM.Va,
    DCR: V_demand / SINGLE_BOX_BEAM.Va,
    pass: sVPass,
  });

  if (sMPass && sVPass) return 'single_box_beam';

  // Try double box beam
  const dMPass = M_demand <= DOUBLE_BOX_BEAM.Mal;
  const dVPass = V_demand <= DOUBLE_BOX_BEAM.Va;

  checks.push({
    label: 'H-Beam (double box beam) – Moment',
    demand: M_demand,
    capacity: DOUBLE_BOX_BEAM.Mal,
    DCR: M_demand / DOUBLE_BOX_BEAM.Mal,
    pass: dMPass,
  });
  checks.push({
    label: 'H-Beam (double box beam) – Shear',
    demand: V_demand,
    capacity: DOUBLE_BOX_BEAM.Va,
    DCR: V_demand / DOUBLE_BOX_BEAM.Va,
    pass: dVPass,
  });

  if (dMPass && dVPass) return 'double_box_beam';

  return 'fails';
}

export function designBumpout(inputs: BumpoutInputs): BumpoutDesignResult {
  const { p_psf, a_ft, b_ft, L_ft, W_ft, S_ft, Va_connection } = inputs;

  const { errors, warnings } = validateInputs(inputs);

  // If there are hard errors, return early with empty results
  if (errors.length > 0) {
    return {
      inputs,
      warnings,
      errors,
      w_box_beam: 0,
      M_box: 0,
      V_box: 0,
      box_beam_selection: 'exceeds',
      w_ledger: 0,
      M_ledger: 0,
      V_ledger: 0,
      P_hbeam: 0,
      ledger_member: 'fails',
      M_hbeam: 0,
      V_hbeam_wall: 0,
      V_hbeam_post: 0,
      hbeam_member: 'fails',
      checks: [],
    };
  }

  const checks: CheckResult[] = [];

  // Derived geometry
  const j = L_ft - a_ft; // backspan (joist span from ledger to wall)

  // -------------------------------------------------------------------------
  // BOX BEAM — spans S between posts
  // Tributary load from cantilever + backspan, expressed as equivalent UDL
  // w_box = p*(j+b)^2 / (2j) + self_weight
  // -------------------------------------------------------------------------
  const w_box_beam_load = (p_psf * Math.pow(j + b_ft, 2)) / (2 * j);
  const w_box_beam = w_box_beam_load + SINGLE_BOX_BEAM.weight_plf;

  const M_box = (w_box_beam * Math.pow(S_ft, 2)) / 8;
  const V_box = (w_box_beam * S_ft) / 2;

  const box_beam_selection = selectBoxBeam(M_box, V_box, w_box_beam, S_ft, checks);

  // -------------------------------------------------------------------------
  // LEDGER — spans W between H-beams
  // w_ledger = p*(j^2 - b^2)/(2j) + self_weight
  // -------------------------------------------------------------------------
  const w_ledger_load = (p_psf * (Math.pow(j, 2) - Math.pow(b_ft, 2))) / (2 * j);
  const w_ledger = w_ledger_load + SINGLE_BOX_BEAM.weight_plf;

  const M_ledger = (w_ledger * Math.pow(W_ft, 2)) / 8;
  const V_ledger = (w_ledger * W_ft) / 2;
  const P_hbeam = V_ledger; // point load transferred to H-beam at ledger connection

  const ledger_member = selectLedger(M_ledger, V_ledger, w_ledger, W_ft, checks);

  // -------------------------------------------------------------------------
  // H-BEAM — spans L (house wall to post line)
  // Two load cases:
  //   Case 1: Point load P_hbeam at x = a from wall
  //   Case 2: Tributary UDL from joists (w_trib = p * joist_spacing/2), over span j
  // -------------------------------------------------------------------------
  const w_trib = p_psf * (JOIST_SPACING_FT / 2); // plf on H-beam from joist tributary

  // Case 1 — Point load at a
  const R_A_pt = (P_hbeam * j) / L_ft;
  const R_B_pt = (P_hbeam * a_ft) / L_ft;
  const M_pt = (P_hbeam * a_ft * j) / L_ft;

  // Case 2 — Partial UDL over backspan j (from wall to ledger at x=a)
  // Reactions and max moment for partial UDL starting at x=a, length j=(L-a)
  // Using standard partial-load formulas:
  //   R_A_trib = w*j^2 / (2*L)
  //   R_B_trib = w*j*(2L - j) / (2*L)
  //   M_trib at x = a + j*(4*L*a + j^2)/(... ) — from spec:
  //     M_trib = w*j^2*(4*L*a + j^2) / (8*L^2)
  const R_A_trib = (w_trib * Math.pow(j, 2)) / (2 * L_ft);
  const R_B_trib = (w_trib * j * (2 * L_ft - j)) / (2 * L_ft);
  const M_trib = (w_trib * Math.pow(j, 2) * (4 * L_ft * a_ft + Math.pow(j, 2))) / (8 * Math.pow(L_ft, 2));

  // Combined
  const M_hbeam = M_pt + M_trib;
  const V_hbeam_wall = R_A_pt + R_A_trib;   // reaction at house wall end
  const V_hbeam_post = R_B_pt + R_B_trib;   // reaction at post end

  const V_hbeam_gov = Math.max(V_hbeam_wall, V_hbeam_post);

  // Optional connection shear check
  if (Va_connection !== undefined) {
    checks.push({
      label: 'H-Beam Connection – Shear',
      demand: V_hbeam_wall,
      capacity: Va_connection,
      DCR: V_hbeam_wall / Va_connection,
      pass: V_hbeam_wall <= Va_connection,
    });
  }

  const hbeam_member = selectHbeam(M_hbeam, V_hbeam_gov, checks);

  return {
    inputs,
    warnings,
    errors,
    w_box_beam,
    M_box,
    V_box,
    box_beam_selection,
    w_ledger,
    M_ledger,
    V_ledger,
    P_hbeam,
    ledger_member,
    M_hbeam,
    V_hbeam_wall,
    V_hbeam_post,
    hbeam_member,
    checks,
  };
}
