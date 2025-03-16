
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useSpotifyAuth } from '@/hooks/use-spotify-auth';
import { getUserPlaylists, getUserTopArtists } from '@/utils/spotifyApi';
import { SpotifyPlaylist, SpotifyArtist } from '@/utils/types';

const LibraryPage: React.FC = () => {
  const { token } = useSpotifyAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [playlistsPage, setPlaylistsPage] = useState(0);
  const [hasMorePlaylists, setHasMorePlaylists] = useState(true);
  
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        // Only get artists initially
        const artistsData = await getUserTopArtists(token, 20);
        setArtists(artistsData.items);
        
        // Get first page of playlists
        await fetchNextPlaylistsPage();
      } catch (error) {
        console.error("Failed to fetch library data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLibrary();
  }, [token]);
  
  const fetchNextPlaylistsPage = async () => {
    if (!token || playlistsLoading || !hasMorePlaylists) return;
    
    setPlaylistsLoading(true);
    try {
      const limit = 20;
      const offset = playlistsPage * limit;
      
      const playlistsData = await getUserPlaylists(token, limit, offset);
      
      // Append new playlists to existing ones
      setPlaylists(prev => [...prev, ...playlistsData.items]);
      
      // Check if we've reached the end
      if (playlistsData.items.length < limit || playlistsData.next === null) {
        setHasMorePlaylists(false);
      } else {
        setPlaylistsPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
      setHasMorePlaylists(false);
    } finally {
      setPlaylistsLoading(false);
    }
  };
  
  // Load more playlists when user scrolls to the bottom
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !playlistsLoading &&
        hasMorePlaylists
      ) {
        fetchNextPlaylistsPage();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [playlistsLoading, hasMorePlaylists]);
  
  if (loading && playlists.length === 0 && artists.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pb-24 md:pb-28">
        <section className="mb-10">
          <h1 className="text-3xl font-bold mb-6">Your Library</h1>
          
          {/* Top Artists */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Top Artists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artists.map(artist => (
                <div 
                  key={artist.id}
                  className="glass-card rounded-lg overflow-hidden hover-scale"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={artist.images?.[0]?.url || '/placeholder.svg'} 
                      alt={artist.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{artist.name}</h3>
                    <p className="text-xs text-muted-foreground">Artist</p>
                  </div>
                </div>
              ))}
              
              {artists.length === 0 && (
                <div className="col-span-full text-center py-6">
                  <p className="text-muted-foreground">No top artists found. Try listening to more music!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Playlists */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {playlists.map(playlist => (
                <div 
                  key={playlist.id}
                  className="glass-card rounded-lg overflow-hidden hover-scale"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={playlist.images[0]?.url || '/placeholder.svg'} 
                      alt={playlist.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{playlist.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {playlist.tracks.total} songs • {playlist.owner.display_name}
                    </p>
                  </div>
                </div>
              ))}
              
              {playlists.length === 0 && !playlistsLoading && (
                <div className="col-span-full text-center py-6">
                  <p className="text-muted-foreground">No playlists found. Create some playlists on Spotify!</p>
                </div>
              )}
            </div>
            
            {/* Loading indicator for playlists */}
            {playlistsLoading && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Loading more playlists...</p>
              </div>
            )}
            
            {/* "Load more" button if we have more playlists to load */}
            {!playlistsLoading && hasMorePlaylists && playlists.length > 0 && (
              <div className="text-center mt-6">
                <button 
                  className="bg-secondary/50 hover:bg-secondary/70 text-white px-4 py-2 rounded-full text-sm"
                  onClick={fetchNextPlaylistsPage}
                >
                  Load More Playlists
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LibraryPage;
