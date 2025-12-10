'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // si ya está autenticado, ir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-white mb-4">
          🎵 Spotify Taste Mixer
        </h1>

        <p className="text-gray-300 text-lg mb-8">
          Crea playlists personalizadas basadas en tus preferencias musicales
        </p>

        <button
          onClick={handleLogin}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-200 mb-6"
        >
          Inicia sesión con Spotify
        </button>

        <div className="bg-gray-800 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-white mb-3">¿Cómo funciona?</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>✓ Selecciona tus artistas favoritos</li>
            <li>✓ Elige géneros y décadas que te gustan</li>
            <li>✓ Filtra por popularidad</li>
            <li>✓ Obtén una playlist personalizada</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


