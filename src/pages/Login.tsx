
import React from 'react';
import { getAuthUrl } from '@/utils/spotifyApi';
import AnimatedBackground from '@/components/AnimatedBackground';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center relative">
      <AnimatedBackground />
      
      <div className="z-10 glass-effect p-8 rounded-xl max-w-md w-full">
        <div className="mb-8">
          <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <img width={'60'} height={'60'} src="/spotunisia-logo.png" alt="Logo" />
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
