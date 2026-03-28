import Image from "next/image";

export default function DiagramGuide() {
  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        📐 Dimension Guide
      </h3>

      <p className="text-base text-gray-700 mb-4">
        Use this diagram to help identify your deck dimensions:
      </p>

      {/* Dimension Legend */}
      <div className="bg-white rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <strong className="text-blue-700">L:</strong> <span className="text-gray-700">Ledger span (backspan)</span>
        </div>
        <div>
          <strong className="text-blue-700">W:</strong> <span className="text-gray-700">Deck width (bumpout)</span>
        </div>
        <div>
          <strong className="text-blue-700">S:</strong> <span className="text-gray-700">Joist spacing</span>
        </div>
        <div>
          <strong className="text-blue-700">a:</strong> <span className="text-gray-700">Beam overhang A</span>
        </div>
        <div>
          <strong className="text-blue-700">b:</strong> <span className="text-gray-700">Beam overhang B</span>
        </div>
        <div>
          <strong className="text-blue-700">p:</strong> <span className="text-gray-700">Deck live load</span>
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

      <p className="text-sm text-gray-600 mt-4 italic">
        💡 Tip: Measure from the house wall to the beam centerline for accurate dimensions.
      </p>
    </div>
  );
}
