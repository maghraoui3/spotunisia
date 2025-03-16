
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSpotifyAuth } from '@/hooks/use-spotify-auth';
import { search } from '@/utils/spotifyApi';
import { SpotifyTrack, SpotifyArtist, SpotifyAlbum, Song, Artist, Album } from '@/utils/types';
import MusicPlayer from '@/components/MusicPlayer';
import SongCard from '@/components/SongCard';
import { useDebounce } from '@/hooks/use-debounce';

const SearchPage: React.FC = () => {
  const { token } = useSpotifyAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [results, setResults] = useState<{tracks: Song[], loading: boolean}>({
    tracks: [],
    loading: false
  });
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use effect for debounced search
  useEffect(() => {
    if (debouncedSearchTerm.trim() && token) {
      performSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm === '') {
      setResults({ tracks: [], loading: false });
    }
  }, [debouncedSearchTerm, token]);
  
  const performSearch = async (term: string) => {
    if (!term.trim() || !token) return;
    
    setResults(prev => ({ ...prev, loading: true }));
    
    try {
      const data = await search(token, term);
      
      // Transform Spotify tracks to our app's format
      const transformedTracks = data.tracks.items.map((track: SpotifyTrack) => {
        const artist: Artist = {
          id: track.artists[0].id,
          name: track.artists[0].name,
          image: track.album.images[0]?.url || ''
        };
        
        const album: Album = {
          id: track.album.id,
          title: track.album.name,
          artist: artist,
          year: new Date(track.album.release_date).getFullYear(),
          cover: track.album.images[0]?.url || '',
          songs: []
        };
        
        const song: Song = {
          id: track.id,
          title: track.name,
          artist: artist,
          album: album,
          duration: formatDuration(track.duration_ms),
          cover: track.album.images[0]?.url || '',
          audio: track.preview_url || '',
          spotifyUrl: track.external_urls.spotify
        };
        
        // Add the song to its album's songs array
        album.songs.push(song);
        
        return song;
      });
      
      setResults({
        tracks: transformedTracks,
        loading: false
      });
    } catch (error) {
      console.error('Search failed:', error);
      setResults({
        tracks: [],
        loading: false
      });
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && token) {
      performSearch(searchTerm);
    }
  };
  
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };
  
  const playSong = (song: Song) => {
    if (currentSong && currentSong.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };
  
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>, song: Song) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If song has audio URL, download it
    if (song.audio) {
      const a = document.createElement('a');
      a.href = song.audio;
      a.download = `${song.artist.name} - ${song.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (song.spotifyUrl) {
      // Otherwise, open Spotify URL
      window.open(song.spotifyUrl, '_blank');
    }
  };

  return (
    <Layout>
      <div className="pb-24 md:pb-28">
        <section className="mb-10">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          
          <form onSubmit={handleSearch} className="relative mb-8">
            <Input
              type="text"
              placeholder="Search for songs, artists, or albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-base bg-secondary/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </form>
          
          {results.loading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : results.tracks.length > 0 ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Songs</h2>
                <div className="space-y-2 bg-white/5 rounded-xl p-4">
                  {results.tracks.map(track => (
                    <SongCard
                      key={track.id}
                      song={track}
                      onClick={() => playSong(track)}
                      isPlaying={isPlaying}
                      isActive={currentSong?.id === track.id}
                      variant="row"
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : searchTerm ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
            </div>
          ) : null}
        </section>
      </div>
      
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => {}} // Implement this
        onPrevious={() => {}} // Implement this
      />
    </Layout>
  );
};

export default SearchPage;
