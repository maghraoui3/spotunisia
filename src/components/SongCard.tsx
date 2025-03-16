
import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { Song } from '@/utils/types';
import { downloadSpotifyTrack } from '@/utils/spotifyApi';
import { toast } from '@/hooks/use-toast';

interface SongCardProps {
  song: Song;
  onClick: () => void;
  isPlaying: boolean;
  isActive: boolean;
  variant: 'grid' | 'row';
  onDownload?: (e: React.MouseEvent<HTMLButtonElement>, song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onClick, 
  isPlaying, 
  isActive,
  variant,
  onDownload = () => {} 
}) => {
  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Try the provided onDownload handler first (for backward compatibility)
    if (onDownload) {
      onDownload(e, song);
    }
    
    // If the song doesn't have a playable audio URL, try to download it from YouTube
    if (!song.audio) {
      try {
        // If we have enough track information, try to download it
        if (song.title && song.artist && song.artist.name) {
          const trackInfo = {
            name: song.title,
            artists: [{ name: song.artist.name }],
            album: {
              images: [{ url: song.cover }]
            }
          };
          
          await downloadSpotifyTrack(trackInfo);
        } else {
          toast({
            title: "Download Failed",
            description: "Insufficient track information for download.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error initiating download:", error);
        toast({
          title: "Download Error",
          description: "Failed to initiate download. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (variant === 'grid') {
    return (
      <div 
        className={`relative group aspect-square overflow-hidden rounded-lg cursor-pointer hover-scale ${isActive ? 'ring-2 ring-primary' : ''}`}
        onClick={onClick}
      >
        {/* Song Cover */}
        <img 
          src={song.cover} 
          alt={song.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button 
              className="download-button opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-full p-2 hover:bg-primary"
              onClick={handleDownload}
              aria-label="Download song"
            >
              <Download size={18} />
            </button>
          </div>
          
          <div>
            <h3 className="font-medium text-shadow">{song.title}</h3>
            <p className="text-xs text-white/80">{song.artist.name}</p>
          </div>
        </div>
        
        {/* Play/Pause Icon */}
        {isActive && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Row variant
  return (
    <div 
      className={`group flex items-center p-2 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
      onClick={onClick}
    >
      {/* Song Number or Play Icon */}
      <div className="w-10 h-10 flex items-center justify-center mr-3">
        {isActive ? (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </div>
        ) : (
          <span className="text-muted-foreground">{song.id.slice(-2)}</span>
        )}
      </div>
      
      {/* Cover Image */}
      <div className="w-10 h-10 mr-3 overflow-hidden rounded">
        <img 
          src={song.cover} 
          alt={song.title} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
      </div>
      
      {/* Song Details */}
      <div className="flex-1 min-w-0">
        <h3 className={`truncate text-sm font-medium ${isActive ? 'text-primary' : ''}`}>{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist.name}</p>
      </div>
      
      {/* Download Button */}
      <button 
        className="download-button mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 rounded-full hover:bg-white/10"
        onClick={handleDownload}
        aria-label="Download song"
      >
        <Download size={18} />
      </button>
      
      {/* Duration */}
      <span className="text-xs text-muted-foreground w-10 text-right">{song.duration}</span>
    </div>
  );
};

export default SongCard;
