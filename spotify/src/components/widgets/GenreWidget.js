'use client';

import { useState } from 'react';

// lista de géneros disponibles
const GENRES = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
  'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
  'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
  'children', 'chill', 'classical', 'club', 'comedy',
  'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
  'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
  'dubstep', 'edm', 'electro', 'electronic', 'emo',
  'folk', 'forro', 'french', 'funk', 'garage',
  'german', 'gospel', 'goth', 'grindcore', 'groove',
  'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
  'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm',
  'indian', 'indie', 'indie-pop', 'industrial', 'iranian',
  'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz',
  'k-pop', 'kids', 'latin', 'latino', 'malay',
  'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
  'movies', 'mpb', 'new-age', 'new-release', 'opera',
  'pagode', 'party', 'philippines-opm', 'piano', 'pop',
  'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock',
  'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae',
  'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
  'romance', 'sad', 'salsa', 'samba', 'sertanejo',
  'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter',
  'soul', 'soundtracks', 'spanish', 'study', 'summer',
  'swedish', 'synth-pop', 'tango', 'techno', 'trance',
  'trip-hop', 'turkish', 'work-out', 'world-music'
];

export default function GenreWidget({ selectedGenres, onSelectGenres }) {
  const [search, setSearch] = useState('');

  // filtrar géneros por búsqueda
  const filteredGenres = GENRES.filter(genre =>
    genre.toLowerCase().includes(search.toLowerCase())
  );

  // agregar o quitar género
  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      onSelectGenres(selectedGenres.filter(g => g !== genre));
    } else {
      // máximo 5 géneros
      if (selectedGenres.length < 5) {
        onSelectGenres([...selectedGenres, genre]);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-2">Géneros</label>

      {/* input búsqueda */}
      <input
        type="text"
        placeholder="Buscar género..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-3 text-sm"
      />

      {/* mostrar géneros seleccionados */}
      {selectedGenres.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedGenres.map(genre => (
            <span
              key={genre}
              className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              {genre}
              <button
                onClick={() => toggleGenre(genre)}
                className="hover:font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* lista de géneros */}
      <div className="bg-gray-700 rounded max-h-32 overflow-y-auto">
        {filteredGenres.map(genre => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-600 ${
              selectedGenres.includes(genre) ? 'bg-green-600 text-white' : 'text-gray-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-2">
        Seleccionados: {selectedGenres.length}/5
      </p>
    </div>
  );
}
