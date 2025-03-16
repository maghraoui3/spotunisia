// Constants for Spotify API
const CLIENT_ID = 'de1a3dbef27c412095ae6de8e88a4964'; // Replace with your Spotify API client ID
const REDIRECT_URI = window.location.origin;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  'user-top-read', // Required for accessing top tracks
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming"
].join("%20");

// Generate the authorization URL
export const getAuthUrl = () => {
  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
};

// Get the access token from URL hash
export const getTokenFromUrl = () => {
  const hash = window.location.hash;
  const stringAfterHash = hash.substring(1);
  const params = stringAfterHash.split("&").reduce((acc: Record<string, string>, item) => {
    if (item) {
      const [key, value] = item.split("=");
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {});

  return params.access_token;
};

// Basic API request function
const apiRequest = async (endpoint: string, token: string) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Spotify API request failed:", error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (token: string) => {
  return apiRequest("/me", token);
};

// Get user's playlists
export const getUserPlaylists = async (token: string, limit: number = 20, offset: number = 0) => {
  const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user playlists: ${response.status}`);
  }
  
  return await response.json();
};

// Get user's liked songs
export const getUserLikedSongs = async (token: string, limit: number = 20) => {
  return apiRequest(`/me/tracks?limit=${limit}`, token);
};

// Get user's top artists
export const getUserTopArtists = async (token: string, limit: number = 10) => {
  return apiRequest(`/me/top/artists?limit=${limit}&time_range=short_term`, token);
};

// Get user's top tracks
export const getUserTopTracks = async (token: string, limit: number = 10) => {
  return apiRequest(`/me/top/tracks?limit=${limit}&time_range=short_term`, token);
};

// Search tracks, artists, albums
export const search = async (token: string, query: string, type = 'track,artist,album', limit: number = 20) => {
  return apiRequest(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`, token);
};

// Get track details
export const getTrack = async (token: string, trackId: string) => {
  return apiRequest(`/tracks/${trackId}`, token);
};

// Get featured playlists
export const getFeaturedPlaylists = async (token: string, limit: number = 6) => {
  return apiRequest(`/browse/featured-playlists?country=US&limit=${limit}`, token);
};

// Get new releases
export const getNewReleases = async (token: string, limit: number = 10) => {
  return apiRequest(`/browse/new-releases?limit=${limit}`, token);
};

// Get recommendations based on user's top tracks
export const getRecommendations = async (token: string, seedTracks: string[], limit: number = 20) => {
  return apiRequest(`/recommendations?seed_tracks=${seedTracks.join(',')}&limit=${limit}`, token);
};
