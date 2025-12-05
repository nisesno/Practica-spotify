'use client';

export default function TrackCard({ track, onRemove, onFavorite, isFavorite }) {
  // obtener la duración en minutos y segundos
  const getDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-600 transition">
      {/* portada del album */}
      {track.album?.images?.[0] && (
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="w-12 h-12 rounded"
        />
      )}

      {/* info del track */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold truncate text-sm">
          {track.name}
        </p>
        <p className="text-gray-300 text-xs truncate">
          {track.artists?.[0]?.name || 'Unknown'}
        </p>
      </div>

      {/* duración */}
      <span className="text-gray-400 text-xs whitespace-nowrap">
        {getDuration(track.duration_ms)}
      </span>

      {/* botones */}
      <div className="flex gap-2">
        <button
          onClick={() => onFavorite(track)}
          className={`px-2 py-1 rounded text-xs ${
            isFavorite
              ? 'bg-red-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          ❤️
        </button>

        <button
          onClick={() => onRemove(track.id)}
          className="px-2 py-1 rounded text-xs bg-gray-600 text-gray-300 hover:bg-red-600 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
