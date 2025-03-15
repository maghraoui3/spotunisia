
import React from 'react';
import { getAuthUrl } from '@/utils/spotifyApi';
import AnimatedBackground from '@/components/AnimatedBackground';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center relative">
      <AnimatedBackground />
      
      <div className="z-10 glass-effect p-8 rounded-xl max-w-md w-full">
        <div className="mb-8">
          <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="black" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-white">Spotunisia</h1>
          <p className="text-gray-400">Connect with your Spotify account to access your music.</p>
        </div>
        
        <a 
          href={getAuthUrl()}
          className="inline-block w-full py-3 px-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-colors"
        >
          Connect with Spotify
        </a>
        
        <p className="mt-6 text-xs text-gray-500">
          By connecting, you authorize Spotunisia to access your Spotify data in accordance with our Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
