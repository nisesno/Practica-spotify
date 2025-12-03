'use client';

export default function PopularityWidget({ popularity, onSelectPopularity }) {
  // popularity es un array [min, max]
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin < popularity[1]) {
      onSelectPopularity([newMin, popularity[1]]);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax > popularity[0]) {
      onSelectPopularity([popularity[0], newMax]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-2">
        Popularidad
      </label>

      <div className="space-y-3">
        {/* slider mínimo */}
        <div>
          <label className="text-gray-400 text-sm">
            Mínimo: {popularity[0]}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={popularity[0]}
            onChange={handleMinChange}
            className="w-full"
          />
        </div>

        {/* slider máximo */}
        <div>
          <label className="text-gray-400 text-sm">
            Máximo: {popularity[1]}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={popularity[1]}
            onChange={handleMaxChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-2 p-2 bg-gray-700 rounded text-center">
        <p className="text-white text-sm">
          {popularity[0]} - {popularity[1]}
        </p>
      </div>
    </div>
  );
}
