"use client";

export interface DiagramValues {
  p_psf?: string;
  a_ft?: string;
  b_ft?: string;
  L_ft?: string;
  W_ft?: string;
  S_ft?: string;
}

interface DiagramGuideProps {
  values?: DiagramValues;
}

export default function DiagramGuide({ values }: DiagramGuideProps) {
  const safeNum = (val: string | undefined, fallback: string): string => {
    const n = parseFloat(val || "");
    return isNaN(n) || n <= 0 ? fallback : String(n);
  };

  const a = safeNum(values?.a_ft, "3");
  const b = safeNum(values?.b_ft, "3");
  const L = safeNum(values?.L_ft, "12");

  const totalSpan = (() => {
    const lNum = parseFloat(L);
    const bNum = parseFloat(b);
    if (!isNaN(lNum) && !isNaN(bNum)) {
      const sum = lNum + bNum;
      return Number.isInteger(sum) ? String(sum) : sum.toFixed(2).replace(/\.?0+$/, "");
    }
    return "15";
  })();

  const wVal = safeNum(values?.W_ft, "");
  const wLabel = wVal ? `W = ${wVal} ft — bumpout width` : "W — bumpout width";

  const svgMarkup = `<svg width="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg">

<defs>
<marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
<mask id="imagine-text-gaps-a04jkb" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="680" height="520" fill="white"/><rect x="314.7908630371094" y="29.99129867553711" width="50.418270111083984" height="21.510875701904297" fill="black" rx="2"/><rect x="608" y="91.32608032226562" width="27.22134780883789" height="18.592395782470703" fill="black" rx="2"/><rect x="608" y="103.32608795166016" width="59.739662170410156" height="18.592395782470703" fill="black" rx="2"/><rect x="607.4163208007812" y="238.32608032226562" width="32.5430850982666" height="18.592395782470703" fill="black" rx="2"/><rect x="607.4163208007812" y="250.3260955810547" width="54.707637786865234" height="18.592395782470703" fill="black" rx="2"/><rect x="608" y="398.32611083984375" width="27.22134780883789" height="18.592395782470703" fill="black" rx="2"/><rect x="608" y="410.32611083984375" width="64.54959487915039" height="18.592395782470703" fill="black" rx="2"/><rect x="648.0962524414062" y="277.3260803222656" width="32.32719039916992" height="18.592395782470703" fill="black" rx="2"/><rect x="647.5125732421875" y="289.3260803222656" width="33.28267860412598" height="18.592395782470703" fill="black" rx="2"/><rect x="648.679931640625" y="301.3260803222656" width="35.315141677856445" height="18.592395782470703" fill="black" rx="2"/><rect x="262.10009765625" y="49.32608413696289" width="123.7997817993164" height="18.592395782470703" fill="black" rx="2"/><rect x="253.4541015625" y="86.32608795166016" width="141.1488494873047" height="18.592395782470703" fill="black" rx="2"/><rect x="249.55520629882812" y="99.32608032226562" width="148.88958740234375" height="18.592395782470703" fill="black" rx="2"/><rect x="23.70099639892578" y="244.3260955810547" width="52.656124114990234" height="18.592395782470703" fill="black" rx="2"/><rect x="171.0389862060547" y="116.32608032226562" width="306.56134033203125" height="18.592395782470703" fill="black" rx="2"/><rect x="303.25067138671875" y="234.32608032226562" width="41.75111389160156" height="18.592395782470703" fill="black" rx="2"/><rect x="-4.0001335973793175" y="358.3260803222656" width="63.20566940307617" height="18.592395782470703" fill="black" rx="2"/><rect x="-0.2608323097229004" y="374.3260803222656" width="59.41083526611328" height="18.592395782470703" fill="black" rx="2"/><rect x="238.84803771972656" y="398.32611083984375" width="170.35647583007812" height="18.592395782470703" fill="black" rx="2"/><rect x="275.8397521972656" y="442.3260803222656" width="96.37769317626953" height="18.592395782470703" fill="black" rx="2"/><rect x="15.999998092651367" y="464.3260803222656" width="128.0589370727539" height="18.592395782470703" fill="black" rx="2"/><rect x="123" y="485.3260803222656" width="52.656131744384766" height="18.592395782470703" fill="black" rx="2"/><rect x="223" y="485.3260803222656" width="74.97271728515625" height="18.592395782470703" fill="black" rx="2"/><rect x="343" y="485.3260803222656" width="41.75111389160156" height="18.592395782470703" fill="black" rx="2"/><rect x="413" y="485.3260803222656" width="63.2056770324707" height="18.592395782470703" fill="black" rx="2"/><rect x="509" y="485.3260803222656" width="59.41083526611328" height="18.592395782470703" fill="black" rx="2"/></mask></defs>

<!-- HOUSE BODY (behind wall) -->
<rect x="0" y="0" width="680" height="80" style="fill:rgb(38, 38, 36);stroke:rgba(222, 220, 209, 0.3);stroke-width:0.5px;opacity:1;"/>
<text x="340" y="46" text-anchor="middle" style="fill:rgb(250, 249, 245);font-size:14px;font-weight:500;">House</text>

<!-- House wall face (bold line) -->
<line x1="0" y1="80" x2="680" y2="80" style="stroke:rgb(250, 249, 245);stroke-width:3px;opacity:0.35;"/>

<!-- BUMPOUT PLATFORM ZONE -->
<rect x="130" y="80" width="388" height="54" style="fill:rgba(56, 139, 213, 0.1);"/>
<!-- deck board hatching -->
<line x1="130" y1="93" x2="518" y2="93" style="stroke:rgba(222, 220, 209, 0.15);stroke-width:0.5px;stroke-dasharray:4px, 3px;" mask="url(#imagine-text-gaps-a04jkb)"/>
<line x1="130" y1="106" x2="518" y2="106" style="stroke:rgba(222, 220, 209, 0.15);stroke-width:0.5px;stroke-dasharray:4px, 3px;" mask="url(#imagine-text-gaps-a04jkb)"/>
<line x1="130" y1="119" x2="518" y2="119" style="stroke:rgba(222, 220, 209, 0.15);stroke-width:0.5px;stroke-dasharray:4px, 3px;" mask="url(#imagine-text-gaps-a04jkb)"/>

<!-- CANTILEVER ZONE -->
<rect x="130" y="386" width="388" height="44" style="fill:rgba(56, 139, 213, 0.06);"/>

<!-- H-BEAM LEFT -->
<rect x="102" y="80" width="28" height="350" rx="2" style="fill:rgb(24, 95, 165);stroke:rgb(12, 68, 124);stroke-width:0.5px;"/>

<!-- H-BEAM RIGHT -->
<rect x="518" y="80" width="28" height="350" rx="2" style="fill:rgb(24, 95, 165);stroke:rgb(12, 68, 124);stroke-width:0.5px;"/>

<!-- LEDGER -->
<rect x="130" y="134" width="388" height="14" rx="2" style="fill:rgb(239, 159, 39);stroke:rgb(186, 117, 23);stroke-width:0.5px;"/>

<!-- JOISTS -->
<rect x="150" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="190" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="230" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="270" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="310" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="350" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="390" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="430" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="470" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<rect x="510" y="148" width="7" height="282" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>

<!-- TWO POSTS -->
<rect x="138" y="356" width="18" height="18" rx="3" style="fill:rgb(95, 94, 90);stroke:rgb(68, 68, 65);stroke-width:1px;"/>
<rect x="492" y="356" width="18" height="18" rx="3" style="fill:rgb(95, 94, 90);stroke:rgb(68, 68, 65);stroke-width:1px;"/>

<!-- BOX BEAM -->
<rect x="130" y="364" width="388" height="22" rx="2" style="fill:rgb(153, 60, 29);stroke:rgb(113, 43, 19);stroke-width:0.5px;"/>
<!-- joist traces through beam -->
<line x1="150" y1="364" x2="150" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="190" y1="364" x2="190" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="230" y1="364" x2="230" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="270" y1="364" x2="270" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="310" y1="364" x2="310" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="350" y1="364" x2="350" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="390" y1="364" x2="390" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="430" y1="364" x2="430" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="470" y1="364" x2="470" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<line x1="510" y1="364" x2="510" y2="386" stroke="#DEB887" stroke-width="5" opacity=".28"/>
<!-- post outlines on beam -->
<rect x="138" y="366" width="18" height="18" rx="2" fill="none" stroke="#D3D1C7" stroke-width="1" stroke-dasharray="3 2"/>
<rect x="492" y="366" width="18" height="18" rx="2" fill="none" stroke="#D3D1C7" stroke-width="1" stroke-dasharray="3 2"/>

<!-- OUTER RIM -->
<rect x="130" y="430" width="388" height="12" rx="2" style="fill:rgb(239, 159, 39);stroke:rgb(186, 117, 23);stroke-width:0.5px;"/>

<!-- DIMENSION LINES (right side) -->
<!-- a_ft: house wall to ledger -->
<line x1="598" y1="80" x2="598" y2="134" stroke="rgb(194, 192, 182)" stroke-width=".5" marker-end="url(#ar)" marker-start="url(#ar)"/>
<line x1="592" y1="80" x2="604" y2="80" stroke="rgb(194, 192, 182)" stroke-width=".5"/>
<line x1="592" y1="134" x2="604" y2="134" stroke="rgb(194, 192, 182)" stroke-width=".5"/>
<text x="612" y="105" style="fill:rgb(194, 192, 182);font-size:12px;font-weight:600;">${a} ft</text>
<text x="612" y="117" style="fill:rgb(194, 192, 182);font-size:12px;">bumpout</text>

<!-- L_ft: ledger to box beam -->
<line x1="598" y1="148" x2="598" y2="364" stroke="rgb(194, 192, 182)" stroke-width=".5" marker-end="url(#ar)" marker-start="url(#ar)"/>
<line x1="592" y1="148" x2="604" y2="148" stroke="rgb(194, 192, 182)" stroke-width=".5"/>
<line x1="592" y1="364" x2="604" y2="364" stroke="rgb(194, 192, 182)" stroke-width=".5"/>
<text x="612" y="252" style="fill:rgb(194, 192, 182);font-size:12px;font-weight:600;">${L} ft</text>
<text x="612" y="264" style="fill:rgb(194, 192, 182);font-size:12px;">to posts</text>

<!-- b_ft: box beam to outer rim -->
<line x1="598" y1="386" x2="598" y2="430" stroke="rgb(194, 192, 182)" stroke-width=".5" marker-end="url(#ar)" marker-start="url(#ar)"/>
<line x1="592" y1="386" x2="604" y2="386" stroke="rgb(194, 192, 182)" stroke-width=".5"/>
<line x1="592" y1="430" x2="604" y2="430" stroke="rgb(194, 192, 182)" stroke-width=".5"/>
<text x="612" y="412" style="fill:rgb(194, 192, 182);font-size:12px;font-weight:600;">${b} ft</text>
<text x="612" y="424" style="fill:rgb(194, 192, 182);font-size:12px;">cantilever</text>

<!-- total joist span -->
<line x1="648" y1="148" x2="648" y2="442" stroke="rgb(156, 154, 146)" stroke-width=".5" stroke-dasharray="4 2" mask="url(#imagine-text-gaps-a04jkb)"/>
<line x1="642" y1="148" x2="654" y2="148" stroke="rgb(156, 154, 146)" stroke-width=".5"/>
<line x1="642" y1="442" x2="654" y2="442" stroke="rgb(156, 154, 146)" stroke-width=".5"/>
<text x="652.68" y="291" style="fill:rgb(194, 192, 182);font-size:12px;font-weight:600;">${totalSpan} ft</text>
<text x="652.68" y="303" style="fill:rgb(194, 192, 182);font-size:12px;">joist</text>
<text x="652.68" y="315" style="fill:rgb(194, 192, 182);font-size:12px;">span</text>

<!-- W dimension (top) -->
<line x1="130" y1="68" x2="518" y2="68" stroke="rgb(156, 154, 146)" stroke-width=".5" marker-end="url(#ar)" marker-start="url(#ar)"/>
<text x="324" y="63" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">${wLabel}</text>

<!-- LABELS -->
<!-- Bumpout label -->
<text x="324" y="100" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">Bumpout deck platform</text>
<text x="324" y="113" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">(${a} ft proud of house wall)</text>

<!-- H-beam labels -->
<text x="50" y="258" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">H-beam</text>
<line x1="76" y1="256" x2="102" y2="256" stroke="rgb(24, 95, 165)" stroke-width=".5" stroke-dasharray="3 2" mask="url(#imagine-text-gaps-a04jkb)"/>

<!-- Ledger -->
<text x="324" y="130" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">Ledger &#8212; at outer edge of bumpout, parallel to house</text>

<!-- Joists label -->
<text x="324" y="248" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">Joists</text>

<!-- Box beam -->
<text x="55.15" y="372" text-anchor="end" style="fill:rgb(194, 192, 182);font-size:12px;">Box beam</text>
<line x1="48" y1="370" x2="129" y2="373" stroke="rgb(194, 192, 182)" stroke-width=".5" stroke-dasharray="3 2" mask="url(#imagine-text-gaps-a04jkb)"/>

<!-- Posts -->
<text x="55.15" y="388" text-anchor="end" style="fill:rgb(194, 192, 182);font-size:12px;">Post (&#215;2)</text>
<line x1="48" y1="386" x2="138" y2="376" stroke="rgb(194, 192, 182)" stroke-width=".5" stroke-dasharray="3 2" mask="url(#imagine-text-gaps-a04jkb)"/>
<line x1="48" y1="386" x2="492" y2="376" stroke="rgb(194, 192, 182)" stroke-width=".5" stroke-dasharray="3 2" mask="url(#imagine-text-gaps-a04jkb)"/>

<!-- Cantilever zone -->
<text x="324" y="412" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">${b} ft cantilever past box beam</text>

<!-- Outer rim -->
<text x="324" y="456" text-anchor="middle" style="fill:rgb(194, 192, 182);font-size:12px;">Outer rim beam</text>

<text x="20" y="478" style="fill:rgb(194, 192, 182);font-size:12px;">Plan view (top-down) — schematic, not to scale</text>

<!-- LEGEND -->
<rect x="110" y="490" width="12" height="10" rx="1" style="fill:rgb(24, 95, 165);stroke:rgb(12, 68, 124);stroke-width:0.5px;"/>
<text x="127" y="499" style="fill:rgb(194, 192, 182);font-size:12px;">H-beam</text>
<rect x="210" y="490" width="12" height="10" rx="1" style="fill:rgb(239, 159, 39);stroke:rgb(186, 117, 23);stroke-width:0.5px;"/>
<text x="227" y="499" style="fill:rgb(194, 192, 182);font-size:12px;">Ledger / rim</text>
<rect x="330" y="490" width="12" height="10" rx="1" style="fill:rgb(222, 184, 135);stroke:rgb(196, 154, 90);stroke-width:0.5px;"/>
<text x="347" y="499" style="fill:rgb(194, 192, 182);font-size:12px;">Joists</text>
<rect x="400" y="490" width="12" height="10" rx="1" style="fill:rgb(153, 60, 29);stroke:rgb(113, 43, 19);stroke-width:0.5px;"/>
<text x="417" y="499" style="fill:rgb(194, 192, 182);font-size:12px;">Box beam</text>
<rect x="498" y="490" width="10" height="10" rx="2" style="fill:rgb(95, 94, 90);stroke:rgb(68, 68, 65);stroke-width:1px;"/>
<text x="513" y="499" style="fill:rgb(194, 192, 182);font-size:12px;">Post (&#215;2)</text>
</svg>`;

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
      <h3 className="text-xl font-bold text-black mb-4">
        📐 Dimension Guide
      </h3>

      <p className="text-base text-black mb-4">
        Use this diagram to help identify your deck dimensions:
      </p>

      {/* SVG Diagram */}
      <div className="bg-white rounded-lg p-4 flex items-center justify-center">
        <div
          className="w-full max-w-2xl"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>

      <p className="text-sm text-black mt-4 italic">
        💡 Tip: Measure from the house wall to the beam centerline for accurate dimensions.
      </p>
    </div>
  );
}
