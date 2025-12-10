'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAccessToken } from '@/lib/auth';
import Header from '@/components/Header';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import PlaylistDisplay from '@/components/PlaylistDisplay';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);
  const [popularity, setPopularity] = useState([0, 100]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

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

  // generar playlist cuando cambien las preferencias
  useEffect(() => {
    if (!genres.length && !decades.length && !artists.length && !tracks.length) {
      return;
    }

    const generatePlaylist = async () => {
      setPlaylistLoading(true);
      try {
        const token = getAccessToken();
        let allTracks = [];

        // agregar tracks seleccionados directamente
        allTracks.push(...tracks);

        // traer canciones de artistas
        for (const artist of artists) {
          const res = await fetch(
            `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          const data = await res.json();
          allTracks.push(...(data.tracks || []));
        }

        // traer canciones por género
        for (const genre of genres) {
          const res = await fetch(
            `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          const data = await res.json();
          allTracks.push(...(data.tracks?.items || []));
        }

        // filtrar por década
        if (decades.length > 0) {
          allTracks = allTracks.filter(track => {
            const year = new Date(track.album?.release_date).getFullYear();
            return decades.some(decade => {
              const decadeStart = parseInt(decade);
              return year >= decadeStart && year < decadeStart + 10;
            });
          });
        }

        // filtrar por popularidad
        allTracks = allTracks.filter(
          track => track.popularity >= popularity[0] && track.popularity <= popularity[1]
        );

        // remover duplicados
        const uniqueTracks = Array.from(
          new Map(allTracks.map(track => [track.id, track])).values()
        ).slice(0, 30);

        setPlaylist(uniqueTracks);
      } catch (err) {
        console.error('error generando playlist:', err);
      } finally {
        setPlaylistLoading(false);
      }
    };

    generatePlaylist();
  }, [genres, decades, popularity, artists, tracks]);

  // remover track
  const removeTrack = (trackId) => {
    setPlaylist(playlist.filter(t => t.id !== trackId));
  };

  // refrescar playlist
  const refreshPlaylist = () => {
    // simplemente regenerar con las mismas preferencias
    // al cambiar el estado se dispara el useEffect
    setPlaylist([]);
    setTimeout(() => {
      setGenres([...genres]);
    }, 100);
  };

  // agregar más tracks
  const addMore = () => {
    // para no hacer demasiado complejo, solo mostramos un mensaje
    console.log('agregar más tracks');
  };

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
            <div className="bg-gray-800 p-6 rounded-lg max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-6">
                Preferencias
              </h2>

              <GenreWidget
                selectedGenres={genres}
                onSelectGenres={setGenres}
              />

              <DecadeWidget
                selectedDecades={decades}
                onSelectDecades={setDecades}
              />

              <PopularityWidget
                popularity={popularity}
                onSelectPopularity={setPopularity}
              />

              <ArtistWidget
                selectedArtists={artists}
                onSelectArtists={setArtists}
              />

              <TrackWidget
                selectedTracks={tracks}
                onSelectTracks={setTracks}
              />
            </div>
          </div>

          {/* playlist a la derecha */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">
                Tu Playlist
              </h2>

              <PlaylistDisplay
                tracks={playlist}
                onRemoveTrack={removeTrack}
                onRefresh={refreshPlaylist}
                onAddMore={addMore}
                loading={playlistLoading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
