// ESR-5257 Table 1, ASD method, AISI S100-16
export const SINGLE_BOX_BEAM = {
  Mal: 7710,           // ft-lb, allowable moment
  Va: 8230,            // lbs, allowable shear
  Ix: 13.76,           // in^4
  Sx: 3.41,            // in^3
  weight_plf: 5.8,     // plf, self-weight
};

export const DOUBLE_BOX_BEAM = {
  Mal: 15420,          // ft-lb, allowable moment
  Va: 16460,           // lbs, allowable shear
  Ix: 27.52,           // in^4
  Sx: 6.82,            // in^3
  weight_plf: 11.6,    // plf, self-weight
};

export const MN_2IN = 4425;       // ft-lb, allowable moment for 2in member (distortional governs)
export const VA_2IN = 4155;       // lbs, allowable shear for 2in member
export const E_CFS_PSI = 29_500_000; // psi, modulus of elasticity for cold-formed steel
export const JOIST_SPACING_FT = 16 / 12; // ft, 16" OC joist spacing
