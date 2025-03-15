
import React from 'react';
import { Album } from '@/utils/musicData';

interface FeaturedAlbumProps {
  album: Album;
  index: number;
  onClick: () => void;
}

const FeaturedAlbum: React.FC<FeaturedAlbumProps> = ({ album, index, onClick }) => {
  // Calculate animation delay based on index
  const animationDelay = `${index * 100}ms`;
  
  return (
    <div 
      className="animate-fade-in hover-scale glass-card rounded-xl overflow-hidden cursor-pointer"
      style={{ animationDelay }}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={album.cover} 
          alt={album.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 text-white">
          <h3 className="font-bold text-xl text-shadow">{album.title}</h3>
          <p className="text-sm text-white/80">{album.artist.name}</p>
        </div>
        
        <div className="absolute top-0 right-0 m-3 px-2 py-1 text-xs bg-black/30 backdrop-blur-md rounded-full text-white">
          {album.year}
        </div>
        
        <div className="opacity-0 hover:opacity-100 absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300">
          <button 
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-black"
            aria-label="Play album"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{album.songs.length} songs</span>
          <span>{album.songs.reduce((acc, song) => acc + parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]), 0) / 60} min</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedAlbum;
