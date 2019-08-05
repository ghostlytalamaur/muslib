export interface Album {
  readonly id: string;
  readonly title: string;
  readonly year: number;
  readonly imageUrl: string;
  readonly artistId: string;
}

export function createAlbum(id: string, title: string, year: number, imageUrl: string, artistId: string): Album {
  return {
    id, title, year, imageUrl , artistId
  };
}
