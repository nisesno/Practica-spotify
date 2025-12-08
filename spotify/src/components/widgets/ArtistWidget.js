'use client';

import { useState, useEffect, useRef } from 'react';
import { getAccessToken } from '@/lib/auth';

export default function ArtistWidget({ selectedArtists, onSelectArtists }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // debouncing para búsqueda
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!search.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(search)}&limit=10`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const data = await response.json();
        setResults(data.artists?.items || []);
      } catch (err) {
        console.error('error en búsqueda:', err);
      } finally {
        setLoading(false);
      }
    }, 500); // esperar 500ms después de que pare de escribir
  }, [search]);

  // agregar o remover artista
  const toggleArtist = (artist) => {
    const exists = selectedArtists.find(a => a.id === artist.id);

    if (exists) {
      onSelectArtists(selectedArtists.filter(a => a.id !== artist.id));
    } else {
      // máximo 5 artistas
      if (selectedArtists.length < 5) {
        onSelectArtists([...selectedArtists, artist]);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-2">Artistas</label>

      {/* input búsqueda */}
      <input
        type="text"
        placeholder="Buscar artista..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-3 text-sm"
      />

      {/* artistas seleccionados */}
      {selectedArtists.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedArtists.map(artist => (
            <div
              key={artist.id}
              className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-2"
            >
              {artist.images?.[0] && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span>{artist.name}</span>
              <button
                onClick={() => toggleArtist(artist)}
                className="hover:font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* resultados de búsqueda */}
      {search && (
        <div className="bg-gray-700 rounded max-h-40 overflow-y-auto">
          {loading && (
            <div className="text-gray-400 text-xs p-3">Buscando...</div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-gray-400 text-xs p-3">Sin resultados</div>
          )}

          {results.map(artist => (
            <button
              key={artist.id}
              onClick={() => toggleArtist(artist)}
              className={`w-full text-left px-3 py-2 text-sm border-b border-gray-600 hover:bg-gray-600 flex items-center gap-2 ${
                selectedArtists.find(a => a.id === artist.id)
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300'
              }`}
            >
              {artist.images?.[0] && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate">{artist.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-gray-400 text-xs mt-2">
        Seleccionados: {selectedArtists.length}/5
      </p>
    </div>
  );
}
