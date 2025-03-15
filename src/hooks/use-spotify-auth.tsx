import { useState, useEffect } from 'react';
import { getTokenFromUrl } from '@/utils/spotifyApi';

// Using function declaration instead of const assignment for better HMR compatibility
function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Prevent multiple initializations
      if (initialized) return;
      
      setLoading(true);
      
      try {
        // Check for token in localStorage first
        const storedToken = localStorage.getItem('spotify_token');
        const storedTokenExpiry = localStorage.getItem('spotify_token_expiry');
        
        const now = new Date().getTime();
        
        // If we have a stored token and it's not expired, use it
        if (storedToken && storedTokenExpiry && parseInt(storedTokenExpiry) > now) {
          setToken(storedToken);
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        // Otherwise, check URL for a new token
        const tokenFromUrl = getTokenFromUrl();
        
        if (tokenFromUrl) {
          // Set expiry to 1 hour from now
          const expiry = new Date().getTime() + 3600 * 1000;
          
          // Store token and expiry
          localStorage.setItem('spotify_token', tokenFromUrl);
          localStorage.setItem('spotify_token_expiry', expiry.toString());
          
          // Clean URL without losing history
          window.history.replaceState({}, document.title, '/');
          
          setToken(tokenFromUrl);
        }
      } catch (err) {
        console.error("Error handling Spotify authentication:", err);
        setError("Failed to authenticate with Spotify");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    initializeAuth();
  }, [initialized]);

  const logout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiry');
    setToken(null);
    // Reset initialization state so we can re-initialize after logout
    setInitialized(false);
  };

  return { token, loading, error, logout, initialized };
}

export { useSpotifyAuth };