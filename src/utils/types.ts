
// Spotify API types
export interface SpotifyImage {
  height: number | null;
  width: number | null;
  url: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  preview_url: string | null;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  tracks: {
    total: number;
  };
  owner: {
    display_name: string;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  images: SpotifyImage[];
  product: string;
  external_urls: {
    spotify: string;
  };
}

// App types
export interface Artist {
  id: string;
  name: string;
  image: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  year: number;
  cover: string;
  songs: Song[];
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: string;
  cover: string;
  audio: string;
  spotifyUrl?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  songs: Song[];
  owner?: string;
}
