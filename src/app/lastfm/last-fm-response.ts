export interface ImageResponse {
  size: 'small' | 'medium' | 'large' | 'extralarge';
  '#text': string;
}

export interface UserInfoResponse {
  user: {
    id: number;
    name: string;
    realName: string;
    url: string;
    image: ImageResponse[];
    country: string;
    age: number;
    gender: string;
    subscriber: number;
    playcount: number;
    playlists: number;
    bootstrap: number;
    registered: { unixtime: string; text: number };
  };
}

export interface ArtistResponse {
  '@attr': {
    rank: number;
  };
  mbid: string;
  url: string;
  playcount: number;
  image: ImageResponse[];
  name: string;
  streamable: number;
}

export interface TopArtistsResponse {
  topartists: {
    artist: ArtistResponse[];
    '@attr': {
      page: number;
      perPage: number;
      user: string;
      total: number;
      totalPages: number;
    };
  };
}
