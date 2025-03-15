
export interface Artist {
  id: string;
  name: string;
  image: string;
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: string;
  cover: string;
  audio: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  year: number;
  cover: string;
  songs: Song[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  songs: Song[];
}

// Sample data
const artists: Artist[] = [
  {
    id: 'artist1',
    name: 'Aurora',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXJ0aXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 'artist2',
    name: 'Luminous',
    image: 'https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJhbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 'artist3',
    name: 'Celestial',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2luZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
];

// Creating albums first with empty songs arrays
export const albums: Album[] = [
  {
    id: 'album1',
    title: 'Ethereal Dreams',
    artist: artists[0],
    year: 2023,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    songs: [],
  },
  {
    id: 'album2',
    title: 'Midnight Waves',
    artist: artists[1],
    year: 2023,
    cover: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    songs: [],
  },
  {
    id: 'album3',
    title: 'Quantum Resonance',
    artist: artists[2],
    year: 2022,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    songs: [],
  },
  {
    id: 'album4',
    title: 'Stellar Echoes',
    artist: artists[0],
    year: 2021,
    cover: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    songs: [],
  },
];

// Define songs with proper references to albums
export const songs: Song[] = [
  {
    id: 'song1',
    title: 'Aurora Borealis',
    artist: artists[0],
    album: albums[0],
    duration: '3:45',
    cover: albums[0].cover,
    audio: 'https://freesound.org/data/previews/612/612095_5674468-lq.mp3',
  },
  {
    id: 'song2',
    title: 'Crystalline',
    artist: artists[0],
    album: albums[0],
    duration: '4:12',
    cover: albums[0].cover,
    audio: 'https://freesound.org/data/previews/612/612092_7037-lq.mp3',
  },
  {
    id: 'song3',
    title: 'Dreamscape',
    artist: artists[0],
    album: albums[0],
    duration: '3:56',
    cover: albums[0].cover,
    audio: 'https://freesound.org/data/previews/612/612087_1648170-lq.mp3',
  },
  {
    id: 'song4',
    title: 'Ocean Depths',
    artist: artists[1],
    album: albums[1],
    duration: '5:23',
    cover: albums[1].cover,
    audio: 'https://freesound.org/data/previews/612/612085_11861866-lq.mp3',
  },
  {
    id: 'song5',
    title: 'Lunar Tides',
    artist: artists[1],
    album: albums[1],
    duration: '4:08',
    cover: albums[1].cover,
    audio: 'https://freesound.org/data/previews/612/612081_2168080-lq.mp3',
  },
  {
    id: 'song6',
    title: 'Starlight Serenade',
    artist: artists[2],
    album: albums[2],
    duration: '3:35',
    cover: albums[2].cover,
    audio: 'https://freesound.org/data/previews/612/612075_11861866-lq.mp3',
  },
  {
    id: 'song7',
    title: 'Cosmic Journey',
    artist: artists[2],
    album: albums[2],
    duration: '6:12',
    cover: albums[2].cover,
    audio: 'https://freesound.org/data/previews/612/612072_1648170-lq.mp3',
  },
  {
    id: 'song8',
    title: 'Nebula Dance',
    artist: artists[2],
    album: albums[2],
    duration: '4:45',
    cover: albums[2].cover,
    audio: 'https://freesound.org/data/previews/612/612058_5674468-lq.mp3',
  },
  {
    id: 'song9',
    title: 'Celestial Harmony',
    artist: artists[0],
    album: albums[3],
    duration: '5:30',
    cover: albums[3].cover,
    audio: 'https://freesound.org/data/previews/612/612053_1648170-lq.mp3',
  },
  {
    id: 'song10',
    title: 'Astral Projection',
    artist: artists[0],
    album: albums[3],
    duration: '4:18',
    cover: albums[3].cover,
    audio: 'https://freesound.org/data/previews/612/612046_11861866-lq.mp3',
  },
];

// Add songs to their respective albums
albums[0].songs = songs.filter(song => song.album.id === 'album1');
albums[1].songs = songs.filter(song => song.album.id === 'album2');
albums[2].songs = songs.filter(song => song.album.id === 'album3');
albums[3].songs = songs.filter(song => song.album.id === 'album4');

export const playlists: Playlist[] = [
  {
    id: 'playlist1',
    title: 'Ambient Focus',
    description: 'Perfect for deep work and concentration',
    cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YW1iaWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    songs: [songs[0], songs[2], songs[4], songs[6], songs[8]],
  },
  {
    id: 'playlist2',
    title: 'Evening Relaxation',
    description: 'Unwind after a long day',
    cover: 'https://images.unsplash.com/photo-1489782419474-4d4221dc5b10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlbmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    songs: [songs[1], songs[3], songs[5], songs[7], songs[9]],
  },
  {
    id: 'playlist3',
    title: 'Cosmic Exploration',
    description: 'Journey through the universe',
    cover: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29zbWljfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    songs: [songs[6], songs[7], songs[8], songs[9], songs[2]],
  },
];

export const featuredAlbums = [albums[0], albums[1], albums[2]];
export const recentlyPlayed = [songs[0], songs[3], songs[6], songs[9]];
export const topSongs = [songs[1], songs[4], songs[7], songs[2]];
