export interface AlbumEntity {
  readonly id: string;
  readonly title: string;
  readonly year: number;
  readonly imageId: string;
  readonly artistId: string;
}

export function createAlbumEntity(id: string, title: string, year: number, imageId: string, artistId: string): AlbumEntity {
  return {
    id, title, year, imageId , artistId
  };
}
