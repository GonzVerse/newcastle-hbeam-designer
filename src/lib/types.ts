export interface BumpoutInputs {
  p_psf: number;        // Total design load (PSF), min 50
  a_ft: number;         // Bumpout depth: house wall → ledger, max 6
  b_ft: number;         // Joist cantilever overhang past post, max 6
  L_ft: number;         // House wall → posts, max 23
  W_ft: number;         // Bumpout width = ledger span, max 13
  S_ft: number;         // Post-to-post spacing = box beam span, max 13
  Va_connection?: number; // Optional: allowable shear at connection (lbs)
}

export interface CheckResult {
  label: string;
  demand: number;
  capacity: number;
  DCR: number;
  pass: boolean;
}

export type MemberSelection =
  | 'single'
  | 'double'
  | 'exceeds'
  | 'single_2in'
  | 'single_box_beam'
  | 'double_box_beam'
  | 'fails';

export interface BumpoutDesignResult {
  inputs: BumpoutInputs;
  warnings: string[];
  errors: string[];
  // Box beam
  w_box_beam: number;
  M_box: number;
  V_box: number;
  box_beam_selection: MemberSelection;
  // Ledger
  w_ledger: number;
  M_ledger: number;
  V_ledger: number;
  P_hbeam: number;
  ledger_member: MemberSelection;
  // H-beam
  M_hbeam: number;
  V_hbeam_wall: number;
  V_hbeam_post: number;
  hbeam_member: MemberSelection;
  // Checks
  checks: CheckResult[];
}
