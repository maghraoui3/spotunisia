
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getUserPlaylists } from '@/utils/spotifyApi';
import { useSpotifyAuth } from '@/hooks/use-spotify-auth';
import { SpotifyPlaylist } from '@/utils/types';
import { Home, Search, Library, PlusSquare, Heart, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const isMobile = useIsMobile();
  const { token } = useSpotifyAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Navigation items
  const navItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Search size={20} />, label: 'Search', path: '/search' },
    { icon: <Library size={20} />, label: 'Your Library', path: '/library' },
    { icon: <PlusSquare size={20} />, label: 'Create Playlist', path: '/create-playlist' },
    { icon: <Heart size={20} />, label: 'Liked Songs', path: '/liked-songs' },
  ];
  
  // Fetch user playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) return;
      setLoading(true);
      
      try {
        const data = await getUserPlaylists(token);
        setPlaylists(data.items);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaylists();
  }, [token]);
  
  const sidebarClasses = `
    ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'sticky top-0 h-screen'}
    w-64 glass-effect border-r border-white/10 overflow-y-auto transition-transform duration-300 ease-in-out
    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
  `;
  
  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}
    
      <aside className={sidebarClasses}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
              <img width={'39'} height={'30'} src="/spotunisia-logo.png" alt="Logo" />
            </div>
            <span className="text-lg font-medium">Spotunisia</span>
          </div>
          
          {/* Navigation */}
          <nav className="mb-8">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.path} 
                    className={`flex items-center gap-4 px-2 py-3 rounded-md transition-colors duration-200 ${index === 0 ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Divider */}
          <div className="h-px bg-white/10 my-4" />
          
          {/* Playlists */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-4">YOUR PLAYLISTS</h3>
            {loading ? (
              <div className="text-sm text-gray-500 text-center py-4">Loading playlists...</div>
            ) : (
              <ul className="space-y-1">
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <a 
                      href={`/playlist/${playlist.id}`} 
                      className="block px-2 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 truncate"
                      title={playlist.name}
                    >
                      {playlist.name}
                    </a>
                  </li>
                ))}
                
                {playlists.length === 0 && (
                  <li className="text-xs text-gray-500 px-2 py-2">
                    No playlists found
                  </li>
                )}
              </ul>
            )}
          </div>
          
          {/* Logout */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-full px-2 py-2 text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
