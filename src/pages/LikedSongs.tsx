import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import MusicPlayer from '@/components/MusicPlayer';
import SongCard from '@/components/SongCard';
import { useSpotifyAuth } from '@/hooks/use-spotify-auth';
import { getUserLikedSongs } from '@/utils/spotifyApi';
import { SpotifyTrack, Song, Artist, Album } from '@/utils/types';
import { Heart } from 'lucide-react';

const LikedSongsPage: React.FC = () => {
  const { token } = useSpotifyAuth();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const data = await getUserLikedSongs(token, 50);
        
        // Transform Spotify tracks to our app's format
        const transformedTracks = data.items.map((item: { track: SpotifyTrack }) => {
          const track = item.track;
          
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
        
        setLikedSongs(transformedTracks);
      } catch (error) {
        console.error("Failed to fetch liked songs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLikedSongs();
  }, [token]);
  
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
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-pink-700 rounded-lg flex items-center justify-center">
              <Heart size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Liked Songs</h1>
              <p className="text-muted-foreground">{likedSongs.length} songs</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Loading your liked songs...</p>
            </div>
          ) : likedSongs.length > 0 ? (
            <div className="space-y-2 bg-white/5 rounded-xl p-4">
              {likedSongs.map(song => (
                <SongCard 
                  key={song.id}
                  song={song}
                  onClick={() => playSong(song)}
                  isPlaying={isPlaying}
                  isActive={currentSong?.id === song.id}
                  variant="row"
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 glass-effect rounded-xl">
              <Heart size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No liked songs yet</h3>
              <p className="text-muted-foreground">Save songs you like by clicking the heart icon in Spotify</p>
            </div>
          )}
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

export default LikedSongsPage;
