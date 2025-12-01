'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import Link from 'next/link';

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    // limpiar tokens
    logout();
    router.push('/');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-2xl font-bold text-green-500">
            🎵 Spotify Mixer
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-3">
              {user.images && user.images[0] && (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-white text-sm">{user.display_name}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
