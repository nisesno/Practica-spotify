'use client';

import { useState, useEffect, useRef } from 'react';
import { getAccessToken } from '@/lib/auth';

export default function TrackWidget({ selectedTracks, onSelectTracks }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // debouncing
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
          `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(search)}&limit=10`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const data = await response.json();
        setResults(data.tracks?.items || []);
      } catch (err) {
        console.error('error en búsqueda:', err);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [search]);

  // toggle track
  const toggleTrack = (track) => {
    const exists = selectedTracks.find(t => t.id === track.id);

    if (exists) {
      onSelectTracks(selectedTracks.filter(t => t.id !== track.id));
    } else {
      if (selectedTracks.length < 5) {
        onSelectTracks([...selectedTracks, track]);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-white font-semibold mb-2">Canciones</label>

      {/* búsqueda */}
      <input
        type="text"
        placeholder="Buscar canción..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-3 text-sm"
      />

      {/* seleccionadas */}
      {selectedTracks.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedTracks.map(track => (
            <div
              key={track.id}
              className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-2"
            >
              {track.album?.images?.[0] && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-4 h-4 rounded"
                />
              )}
              <span className="truncate max-w-20">{track.name}</span>
              <button
                onClick={() => toggleTrack(track)}
                className="hover:font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* resultados */}
      {search && (
        <div className="bg-gray-700 rounded max-h-40 overflow-y-auto">
          {loading && (
            <div className="text-gray-400 text-xs p-3">Buscando...</div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-gray-400 text-xs p-3">Sin resultados</div>
          )}

          {results.map(track => (
            <button
              key={track.id}
              onClick={() => toggleTrack(track)}
              className={`w-full text-left px-3 py-2 text-xs border-b border-gray-600 hover:bg-gray-600 flex items-center gap-2 ${
                selectedTracks.find(t => t.id === track.id)
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300'
              }`}
            >
              {track.album?.images?.[0] && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-6 h-6 rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">{track.name}</p>
                <p className="text-gray-400 truncate text-xs">
                  {track.artists?.[0]?.name || 'Unknown'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-gray-400 text-xs mt-2">
        Seleccionadas: {selectedTracks.length}/5
      </p>
    </div>
  );
}
