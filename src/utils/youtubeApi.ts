
/**
 * Utility functions for interacting with YouTube to search for songs
 */

/**
 * Search YouTube for a video matching the given query (artist + song title)
 * @param searchQuery The search query (usually artist name + song title)
 * @returns The first matching YouTube video ID
 */
export const searchYouTube = async (searchQuery: string): Promise<string | null> => {
  try {
    // Encode the search query for URL
    const encodedQuery = encodeURIComponent(searchQuery);
    
    // We'll use a proxy approach to avoid CORS issues
    // In a production app, this should be handled through a serverless function or backend
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://www.youtube.com/results?search_query=${encodedQuery}`)}`;
    
    const response = await fetch(proxyUrl);
    const html = await response.text();
    
    // Extract video IDs using regex pattern similar to the Python code
    const videoIdMatch = html.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
    
    return videoIdMatch ? videoIdMatch[1] : null;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return null;
  }
};

/**
 * Gets the download URL for a YouTube video
 * This is using yt-dlp's approach via api
 * Note: In a production app, this would be handled through a backend service
 */
export const getAudioDownloadUrl = async (videoId: string): Promise<string | null> => {
  try {
    // In a real implementation, this would be a call to your backend service
    // that uses something like yt-dlp to get the actual audio stream
    // For demo purposes, we're just constructing a URL to a YouTube video
    // that would allow direct playback
    
    // For simplicity in this demo, we'll just return a YouTube embedded URL
    // In a production app, you'd need proper server-side processing
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } catch (error) {
    console.error("Error getting audio download URL:", error);
    return null;
  }
};

/**
 * Downloads an audio file from the given URL
 * @param url The URL to download from
 * @param filename The filename to save as
 */
export const downloadAudio = async (videoId: string, artistName: string, trackName: string): Promise<boolean> => {
  try {
    // In a real implementation, this would be handled on the server-side
    // using something like yt-dlp to properly download and convert to mp3
    
    // For client-side demo, we can only offer to open the video in a new tab
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    return true;
  } catch (error) {
    console.error("Error downloading audio:", error);
    return false;
  }
};

/**
 * Sanitize filename to remove invalid characters
 */
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^\w\s.-]/gi, '');
};
