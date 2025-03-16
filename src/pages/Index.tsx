import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MusicPlayer from '@/components/MusicPlayer';
import SongCard from '@/components/SongCard';
import FeaturedAlbum from '@/components/FeaturedAlbum';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpotifyAuth } from '@/hooks/use-spotify-auth';
import { 
  getUserProfile, 
  getUserTopTracks, 
  getNewReleases, 
  getFeaturedPlaylists, 
  getRecommendations 
} from '@/utils/spotifyApi';
import { SpotifyUser, SpotifyTrack, SpotifyAlbum, SpotifyPlaylist, Song, Artist, Album } from '@/utils/types';

const Index = () => {
  const isMobile = useIsMobile();
  const { token } = useSpotifyAuth();
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [topTracks, setTopTracks] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const userData = await getUserProfile(token);
        console.log('User data:', userData);
        
        const topTracksData = await getUserTopTracks(token, 20);
        console.log('Top tracks data:', topTracksData);
        
        const newReleasesData = await getNewReleases(token, 10);
        console.log('New releases data:', newReleasesData);
        
        let featuredPlaylistsData = null;
        try {
          featuredPlaylistsData = await getFeaturedPlaylists(token, 6);
          console.log('Featured playlists data:', featuredPlaylistsData);
        } catch (error) {
          console.error("Failed to fetch featured playlists:", error);
        }
        
        setUser(userData);
        
        if (topTracksData && topTracksData.items && topTracksData.items.length > 0) {
          const transformedTopTracks = topTracksData.items.map(transformSpotifyTrack);
          setTopTracks(transformedTopTracks);
          
          if (transformedTopTracks.length > 0) {
            const seedTrackIds = topTracksData.items
              .slice(0, 5)
              .map((track: SpotifyTrack) => track.id);
              
            const recommendationsData = await getRecommendations(token, seedTrackIds);
            console.log('Recommendations data:', recommendationsData);
            
            if (recommendationsData && recommendationsData.tracks) {
              const transformedRecommendations = recommendationsData.tracks.map(transformSpotifyTrack);
              setRecentlyPlayed(transformedRecommendations);
            }
          }
        } else {
          if (newReleasesData && newReleasesData.albums && newReleasesData.albums.items) {
            const tracks = newReleasesData.albums.items
              .slice(0, 10)
              .map((album: SpotifyAlbum) => {
                return {
                  id: album.id,
                  name: album.name,
                  duration_ms: 180000,
                  preview_url: null,
                  album: album,
                  artists: album.artists,
                  external_urls: album.external_urls
                } as SpotifyTrack;
              });
              
            const transformedTracks = tracks.map(transformSpotifyTrack);
            setTopTracks(transformedTracks);
            setRecentlyPlayed(transformedTracks);
          }
        }
        
        if (newReleasesData && newReleasesData.albums && newReleasesData.albums.items) {
          const transformedAlbums = newReleasesData.albums.items.map((album: SpotifyAlbum) => {
            const artist: Artist = {
              id: album.artists[0].id,
              name: album.artists[0].name,
              image: album.images[0]?.url || ''
            };
            
            return {
              id: album.id,
              title: album.name,
              artist: artist,
              year: new Date(album.release_date).getFullYear(),
              cover: album.images[0]?.url || '',
              songs: []
            };
          });
          
          setFeaturedAlbums(transformedAlbums);
        }
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);
  
  const transformSpotifyTrack = (track: SpotifyTrack): Song => {
    try {
      const artist: Artist = {
        id: track.artists[0].id,
        name: track.artists[0].name,
        image: track.album?.images[0]?.url || ''
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
      
      album.songs.push(song);
      
      return song;
    } catch (error) {
      console.error("Error transforming track:", error, track);
      return {
        id: track.id || 'unknown',
        title: track.name || 'Unknown Track',
        artist: {
          id: 'unknown',
          name: 'Unknown Artist',
          image: ''
        },
        album: {
          id: 'unknown',
          title: 'Unknown Album',
          artist: {
            id: 'unknown',
            name: 'Unknown Artist',
            image: ''
          },
          year: 2023,
          cover: '',
          songs: []
        },
        duration: '0:00',
        cover: '',
        audio: '',
        spotifyUrl: ''
      };
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
      
      if (song.album.songs.length > 0) {
        const songIndex = song.album.songs.findIndex(s => s.id === song.id);
        const songsAfter = song.album.songs.slice(songIndex + 1);
        const songsBefore = song.album.songs.slice(0, songIndex);
        setQueue([...songsAfter, ...songsBefore]);
      } else {
        setQueue(topTracks.filter(s => s.id !== song.id));
      }
    }
  };
  
  const playAlbum = (album: Album) => {
    if (album.songs.length > 0) {
      const firstSong = album.songs[0];
      setCurrentSong(firstSong);
      setIsPlaying(true);
      setQueue(album.songs.slice(1));
    } else {
      if (recentlyPlayed.length > 0) {
        const firstSong = recentlyPlayed[0];
        setCurrentSong(firstSong);
        setIsPlaying(true);
        setQueue(recentlyPlayed.slice(1));
      }
    }
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      const remainingQueue = queue.slice(1);
      
      setCurrentSong(nextSong);
      setQueue(remainingQueue);
      setIsPlaying(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentSong) {
      const audio = document.querySelector('audio');
      if (audio) {
        audio.currentTime = 0;
      }
    }
  };
  
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>, song: Song) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (song.audio) {
      const a = document.createElement('a');
      a.href = song.audio;
      a.download = `${song.artist.name} - ${song.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (song.spotifyUrl) {
      window.open(song.spotifyUrl, '_blank');
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Loading your music...</p>
        </div>
      </Layout>
    );
  }
  
  if (!user && topTracks.length === 0 && featuredAlbums.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-2xl font-bold mb-4">No music data available</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any music data for your account. This might happen if:
          </p>
          <ul className="list-disc text-left text-muted-foreground mb-8 space-y-2">
            <li>You're new to Spotify and haven't listened to music yet</li>
            <li>The Spotify API is temporarily unavailable</li>
            <li>Your authorization needs to be refreshed</li>
          </ul>
          <button 
            className="bg-primary text-white px-6 py-3 rounded-full font-medium"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pb-24 md:pb-28">
        <section className="mb-10 animate-fade-in">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full glass-effect text-xs uppercase tracking-wider mb-2">Premium Music</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {user ? `Welcome back, ${user.display_name}` : 'Welcome to Spotunisia'}
            </h1>
            <p className="text-gray-400 mt-2">Download and enjoy unlimited music</p>
          </div>
        </section>
        
        {featuredAlbums.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">Featured Albums</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAlbums.slice(0, 3).map((album, index) => (
                <FeaturedAlbum 
                  key={album.id}
                  album={album}
                  index={index}
                  onClick={() => playAlbum(album)}
                />
              ))}
            </div>
          </section>
        )}
        
        {recentlyPlayed.length > 0 && (
          <section className="mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-semibold mb-6">Recommended For You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {recentlyPlayed.slice(0, 4).map(song => (
                <SongCard 
                  key={song.id}
                  song={song}
                  onClick={() => playSong(song)}
                  isPlaying={isPlaying}
                  isActive={currentSong?.id === song.id}
                  variant="grid"
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </section>
        )}
        
        {topTracks.length > 0 && (
          <section className="mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-semibold mb-6">Your Top Tracks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topTracks.slice(0, 5).map(song => (
                <div key={song.id} className="glass-card rounded-xl p-4 hover-scale">
                  <div 
                    className="flex items-center gap-4 cursor-pointer" 
                    onClick={() => playSong(song)}
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <img 
                        src={song.cover || '/placeholder.svg'} 
                        alt={song.title} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {currentSong?.id === song.id && (
                        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                            {isPlaying ? (
                              <span className="pause-icon"></span>
                            ) : (
                              <span className="play-icon"></span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">{song.title}</h3>
                      <p className="text-gray-400 truncate">{song.artist.name}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          className="download-button opacity-100 text-xs bg-primary/80 hover:bg-primary px-3 py-1"
                          onClick={(e) => handleDownload(e, song)}
                        >
                          Download
                        </button>
                        <span className="text-xs text-gray-500">{song.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {topTracks.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h2 className="text-2xl font-semibold mb-6">All Tracks</h2>
            <div className="space-y-2 bg-white/5 rounded-xl p-4">
              {topTracks.map(song => (
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
          </section>
        )}
      </div>
      
      <MusicPlayer 
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default Index;
