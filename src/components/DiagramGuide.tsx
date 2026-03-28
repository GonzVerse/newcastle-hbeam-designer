import Image from "next/image";

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
  function formatValue(val: string | undefined, unit: string): string {
    if (!val || val.trim() === "") return "";
    return `: ${val} ${unit}`;
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
      <h3 className="text-xl font-bold text-black mb-4">
        📐 Dimension Guide
      </h3>

      <p className="text-base text-black mb-4">
        Use this diagram to help identify your deck dimensions:
      </p>

      {/* Dimension Legend */}
      <div className="bg-white rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <strong className="text-blue-700">p</strong><span className="text-black">{formatValue(values?.p_psf, "PSF") || ": Floor Load (PSF)"}</span>
        </div>
        <div>
          <strong className="text-blue-700">a</strong><span className="text-black">{formatValue(values?.a_ft, "ft") || ": Bumpout Depth (ft)"}</span>
        </div>
        <div>
          <strong className="text-blue-700">b</strong><span className="text-black">{formatValue(values?.b_ft, "ft") || ": Overhang Past Post (ft)"}</span>
        </div>
        <div>
          <strong className="text-blue-700">L</strong><span className="text-black">{formatValue(values?.L_ft, "ft") || ": Wall to Posts (ft)"}</span>
        </div>
        <div>
          <strong className="text-blue-700">W</strong><span className="text-black">{formatValue(values?.W_ft, "ft") || ": Bumpout Width (ft)"}</span>
        </div>
        <div>
          <strong className="text-blue-700">S</strong><span className="text-black">{formatValue(values?.S_ft, "ft") || ": Post Spacing (ft)"}</span>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="bg-white rounded-lg p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <Image
            src="/bumpout_deck_plan.svg"
            alt="Bumpout deck plan showing dimensions L, W, S, a, and b"
            width={800}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <p className="text-sm text-black mt-4 italic">
        💡 Tip: Measure from the house wall to the beam centerline for accurate dimensions.
      </p>
    </div>
  );
}
