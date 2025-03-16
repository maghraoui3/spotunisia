
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
 * Get the best audio stream URL for a YouTube video.
 * Note: This is a simplified version and won't work in all browsers due to CORS restrictions.
 * A proper implementation would require a backend service.
 */
export const getYouTubeAudioStream = async (videoId: string): Promise<string | null> => {
  try {
    // This is a public YouTube API proxy that may work in some cases
    // Note: In a production environment, this should be handled through a backend service
    const apiUrl = `https://pipedapi.kavin.rocks/streams/${videoId}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio streams: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Try to find the audio-only stream with the highest quality
    const audioStreams = data.audioStreams || [];
    if (audioStreams.length > 0) {
      // Sort by quality (usually bitrate)
      const sortedStreams = audioStreams.sort((a: any, b: any) => 
        parseInt(b.bitrate) - parseInt(a.bitrate)
      );
      
      return sortedStreams[0].url;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting YouTube audio stream:", error);
    return null;
  }
};

/**
 * Fetch an image as a blob
 */
const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.blob();
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

/**
 * Fetch audio as a blob
 */
const fetchAudioAsBlob = async (url: string): Promise<Blob | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.blob();
  } catch (error) {
    console.error("Error fetching audio:", error);
    return null;
  }
};

/**
 * Downloads an audio file from the given URL
 * @param videoId The YouTube video ID
 * @param artistName The artist name (for filename)
 * @param trackName The track name (for filename)
 * @param coverUrl The URL of the album cover image
 */
export const downloadAudio = async (
  videoId: string, 
  artistName: string, 
  trackName: string,
  coverUrl?: string
): Promise<boolean> => {
  try {
    // First try to get the audio stream URL
    const audioUrl = await getYouTubeAudioStream(videoId);
    
    if (!audioUrl) {
      // Fallback: If we can't get the audio stream, open YouTube in a new tab
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      return true;
    }
    
    // Try to fetch the audio as a blob
    const audioBlob = await fetchAudioAsBlob(audioUrl);
    if (!audioBlob) {
      // Fallback: If we can't download the audio, open YouTube in a new tab
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      return true;
    }
    
    // Generate a download link
    const filename = sanitizeFilename(`${artistName} - ${trackName}.mp3`);
    const downloadUrl = URL.createObjectURL(audioBlob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error("Error downloading audio:", error);
    
    // Fallback: Open YouTube in a new tab
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    return false;
  }
};

/**
 * Sanitize filename to remove invalid characters
 */
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^\w\s.-]/gi, '');
};
