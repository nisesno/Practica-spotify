'use client';

const DECADES = [
  '1950', '1960', '1970', '1980', '1990',
  '2000', '2010', '2020'
];

export default function DecadeWidget({ selectedDecades, onSelectDecades }) {
  // agregar o quitar década
  const toggleDecade = (decade) => {
    if (selectedDecades.includes(decade)) {
      onSelectDecades(selectedDecades.filter(d => d !== decade));
    } else {
      onSelectDecades([...selectedDecades, decade]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-2">Décadas</label>

      <div className="grid grid-cols-2 gap-2">
        {DECADES.map(decade => (
          <button
            key={decade}
            onClick={() => toggleDecade(decade)}
            className={`px-3 py-2 rounded text-sm font-semibold transition ${
              selectedDecades.includes(decade)
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {decade}s
          </button>
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-2">
        Seleccionadas: {selectedDecades.length}
      </p>
    </div>
  );
}
