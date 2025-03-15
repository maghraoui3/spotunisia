
import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { Song } from '@/utils/types';

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
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDownload(e, song);
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
              className="download-button"
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
        className="download-button mr-2"
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
