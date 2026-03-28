"use client";

import { useState } from "react";

export interface Check {
  label: string;
  demand: number;
  capacity: number;
  DCR: number;
  pass: boolean;
}

export interface DesignResult {
  inputs: Record<string, number>;
  warnings: string[];
  errors: string[];
  w_box_beam: number;
  M_box: number;
  V_box: number;
  box_beam_selection: string;
  w_ledger: number;
  M_ledger: number;
  V_ledger: number;
  P_hbeam: number;
  ledger_member: string;
  M_hbeam: number;
  V_hbeam_wall: number;
  V_hbeam_post: number;
  hbeam_member: string;
  checks: Check[];
}

interface ResultsDisplayProps {
  result: DesignResult;
}

function formatValue(val: number, label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("deflect") || lower.includes("defl")) {
    return `${val.toFixed(3)} in`;
  }
  if (lower.includes("moment") || lower.includes("ft-lb")) {
    return `${Math.round(val).toLocaleString()} ft-lb`;
  }
  return `${Math.round(val).toLocaleString()} lbs`;
}

function formatCapacity(cap: number, label: string): string {
  return formatValue(cap, label);
}

function formatMemberSelection(selection: string): string {
  const mapping: Record<string, string> = {
    "single": "Single Box Beam",
    "double": "Double Box Beam",
    "exceeds": "EXCEEDS CAPACITY",
    "single_2in": "Single 2-inch Joist",
    "single_box_beam": "Single Box Beam",
    "double_box_beam": "Double Box Beam",
    "fails": "DESIGN FAILS",
  };
  return mapping[selection] || selection;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [checksOpen, setChecksOpen] = useState(false);

  const totalChecks = result.checks.length;
  const failedChecks = result.checks.filter((c) => !c.pass).length;

  // Design passes when all checks pass, no errors, and no member selections are "exceeds" or "fails"
  const membersFail =
    result.box_beam_selection === "exceeds" ||
    result.ledger_member === "fails" ||
    result.hbeam_member === "fails";

  const allPass = failedChecks === 0 && result.errors.length === 0 && !membersFail;

  const members = [
    {
      name: "Outer Beam",
      selection: result.box_beam_selection,
      detail: `Load: ${Math.round(result.w_box_beam)} plf — Moment: ${Math.round(result.M_box).toLocaleString()} ft-lb — Shear: ${Math.round(result.V_box).toLocaleString()} lbs`,
    },
    {
      name: "Ledger",
      selection: result.ledger_member,
      detail: `Load: ${Math.round(result.w_ledger)} plf — Moment: ${Math.round(result.M_ledger).toLocaleString()} ft-lb — Shear: ${Math.round(result.V_ledger).toLocaleString()} lbs`,
    },
    {
      name: "Side Brackets (H-Beam)",
      selection: result.hbeam_member,
      detail: `Point load: ${Math.round(result.P_hbeam).toLocaleString()} lbs — Moment: ${Math.round(result.M_hbeam).toLocaleString()} ft-lb`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Status Banner */}
      <div
        className={`rounded-xl px-6 py-5 text-center ${
          allPass
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
        role="status"
        aria-live="polite"
      >
        <p className="text-3xl font-black tracking-wide">
          {allPass ? "ALL CHECKS PASS" : `${failedChecks} CHECK${failedChecks !== 1 ? "S" : ""} FAILED`}
        </p>
        <p className="text-lg mt-1 opacity-90">
          {totalChecks} checks total
        </p>
      </div>

      {/* Member Selections */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Member Selections
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {members.map((member) => {
            const memberChecks = result.checks.filter((c) =>
              c.label.toLowerCase().includes(member.name.toLowerCase().split(" ")[0])
            );
            const memberPass = memberChecks.every((c) => c.pass);
            const hasChecks = memberChecks.length > 0;

            // Member fails if selection is "exceeds" or "fails"
            const selectionFails = member.selection === "exceeds" || member.selection === "fails";
            const statusPass = (!hasChecks || memberPass) && !selectionFails;

            return (
              <div
                key={member.name}
                className={`rounded-xl border-2 p-5 ${
                  statusPass
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-gray-800">{member.name}</h3>
                  <span
                    className={`text-2xl font-black flex-shrink-0 ${
                      statusPass ? "text-green-600" : "text-red-600"
                    }`}
                    aria-label={statusPass ? "Pass" : "Fail"}
                  >
                    {statusPass ? "✓" : "✗"}
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatMemberSelection(member.selection)}</p>
                <p className="text-sm text-gray-600 mt-1">{member.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Check Details (collapsible) */}
      <section>
        <button
          type="button"
          onClick={() => setChecksOpen((o) => !o)}
          className="flex items-center gap-2 w-full text-left text-xl font-bold text-gray-700 uppercase tracking-wide py-3 border-b-2 border-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          aria-expanded={checksOpen}
        >
          <span className="text-lg">{checksOpen ? "▼" : "▶"}</span>
          Check Details ({totalChecks} checks)
        </button>

        {checksOpen && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-base border-collapse">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="text-left px-4 py-3 font-bold">Check</th>
                  <th className="text-right px-4 py-3 font-bold">Demand</th>
                  <th className="text-right px-4 py-3 font-bold">Capacity</th>
                  <th className="text-right px-4 py-3 font-bold">Ratio</th>
                  <th className="text-center px-4 py-3 font-bold">Pass?</th>
                </tr>
              </thead>
              <tbody>
                {result.checks.map((check, i) => (
                  <tr
                    key={i}
                    className={
                      check.pass
                        ? "bg-green-50 border-b border-green-200"
                        : "bg-red-50 border-b border-red-200"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{check.label}</td>
                    <td className="px-4 py-3 text-right text-gray-700 font-mono">
                      {formatValue(check.demand, check.label)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 font-mono">
                      {formatCapacity(check.capacity, check.label)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-bold font-mono ${
                        check.pass ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {check.DCR.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block text-xl font-black ${
                          check.pass ? "text-green-600" : "text-red-600"
                        }`}
                        aria-label={check.pass ? "Pass" : "Fail"}
                      >
                        {check.pass ? "✓" : "✗"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-yellow-700 mb-3 uppercase tracking-wide">
            Warnings
          </h2>
          <div className="space-y-2">
            {result.warnings.map((w, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-yellow-50 border-2 border-yellow-400 rounded-xl px-5 py-4"
                role="alert"
              >
                <span className="text-yellow-600 text-2xl flex-shrink-0 font-bold">!</span>
                <p className="text-base text-yellow-800 font-medium">{w}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Errors */}
      {result.errors.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-red-700 mb-3 uppercase tracking-wide">
            Errors
          </h2>
          <div className="space-y-2">
            {result.errors.map((err, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-red-50 border-2 border-red-500 rounded-xl px-5 py-4"
                role="alert"
              >
                <span className="text-red-600 text-2xl flex-shrink-0 font-bold">✗</span>
                <p className="text-base text-red-800 font-medium">{err}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
