'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAccessToken } from '@/lib/auth';
import Header from '@/components/Header';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [widgets, setWidgets] = useState({
    genres: [],
    decades: [],
    popularity: [0, 100]
  });
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    // verificar que esté logeado
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    // traer usuario
    const fetchUser = async () => {
      try {
        const token = getAccessToken();
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">
          Hola {user?.display_name}! 🎵
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* widgets a la izquierda */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">
                Tus Preferencias
              </h2>
              {/* TODO: agregar widgets aquí */}
              <p className="text-gray-400">widgets...</p>
            </div>
          </div>

          {/* playlist a la derecha */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">
                Tu Playlist
              </h2>
              {/* TODO: mostrar canciones aquí */}
              <p className="text-gray-400">canciones...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
