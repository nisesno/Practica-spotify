'use client';

import { useState, useEffect } from 'react';
import TrackCard from './TrackCard';

export default function PlaylistDisplay({
  tracks,
  onRemoveTrack,
  onRefresh,
  onAddMore,
  loading
}) {
  const [favorites, setFavorites] = useState([]);

  // cargar favoritos de localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favorite_tracks');
    if (fav) {
      setFavorites(JSON.parse(fav));
    }
  }, []);

  // agregar a favoritos
  const handleFavorite = (track) => {
    const exists = favorites.find(f => f.id === track.id);

    if (exists) {
      // remover favorito
      const updated = favorites.filter(f => f.id !== track.id);
      setFavorites(updated);
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
    } else {
      // agregar favorito
      const updated = [...favorites, track];
      setFavorites(updated);
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Generando playlist...</p>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Selecciona preferencias para generar playlist</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* info */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">
          {tracks.length} canciones
        </p>

        {/* botones de acciones */}
        <div className="flex gap-2">
          <button
            onClick={onAddMore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            + Más
          </button>

          <button
            onClick={onRefresh}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            🔄 Refrescar
          </button>
        </div>
      </div>

      {/* lista de canciones */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {tracks.map(track => (
          <TrackCard
            key={track.id}
            track={track}
            onRemove={onRemoveTrack}
            onFavorite={handleFavorite}
            isFavorite={favorites.some(f => f.id === track.id)}
          />
        ))}
      </div>
    </div>
  );
}
