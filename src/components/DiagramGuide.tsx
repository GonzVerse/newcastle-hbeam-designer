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
  // Keep the values available for future interactive diagram enhancements
  // Currently the SVG is static, but values are tracked for potential updates

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
