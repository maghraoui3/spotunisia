
import React, { useRef, useState, useEffect } from 'react';
import { Song } from '@/utils/musicData';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  // Update audio element when currentSong changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      const audio = audioRef.current;
      
      // Set the new source
      audio.src = currentSong.audio;
      
      // Load the audio
      audio.load();
      
      // Play if isPlaying is true
      if (isPlaying) {
        audio.play()
          .catch(error => console.error("Error playing audio:", error));
      }
    }
  }, [currentSong]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
          .catch(error => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle timeupdate event
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Handle audio loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Handle track end
  const handleEnded = () => {
    onNext();
  };
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // If no song is selected
  if (!currentSong) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/10 py-3 px-4 transition-all duration-300 animate-slide-up z-50">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      {/* Progress bar - visible on all screen sizes */}
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-white"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        {/* Song info */}
        <div className="flex items-center max-w-[30%]">
          <div className="w-12 h-12 rounded overflow-hidden shadow-lg mr-3 flex-shrink-0">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{currentSong.title}</h4>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist.name}</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button 
            className="text-gray-300 hover:text-white transition-colors hidden sm:block"
            onClick={onPrevious}
            aria-label="Previous song"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
          </button>
          
          <button 
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-md"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
          
          <button 
            className="text-gray-300 hover:text-white transition-colors hidden sm:block"
            onClick={onNext}
            aria-label="Next song"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </button>
        </div>
        
        {/* Volume and time indicators */}
        <div className="hidden md:flex items-center space-x-3 max-w-[30%]">
          <div className="text-xs text-gray-400 w-14 text-right">
            {formatTime(currentTime)}
          </div>
          
          <span className="text-gray-500 text-xs">/</span>
          
          <div className="text-xs text-gray-400 w-14">
            {formatTime(duration)}
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              {volume === 0 ? (
                <>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                  <line x1="9" y1="17" x2="9" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                  <line x1="15" y1="17" x2="15" y2="21"></line>
                </>
              ) : volume < 0.3 ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </>
              ) : volume < 0.7 ? (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </>
              ) : (
                <>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </>
              )}
            </svg>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 appearance-none bg-gray-700 rounded-full overflow-hidden cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(to right, white ${volume * 100}%, transparent ${volume * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Seekbar - below player on mobile */}
      <div className="flex items-center space-x-3 mt-3 md:hidden">
        <span className="text-xs text-gray-400 w-8">
          {formatTime(currentTime)}
        </span>
        
        <input 
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 appearance-none bg-gray-700 rounded-full overflow-hidden cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(to right, white ${(currentTime / (duration || 1)) * 100}%, transparent ${(currentTime / (duration || 1)) * 100}%)`,
          }}
        />
        
        <span className="text-xs text-gray-400 w-8 text-right">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;
