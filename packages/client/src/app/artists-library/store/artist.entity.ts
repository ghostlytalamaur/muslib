export interface ArtistEntity {
  readonly id: string;
  readonly name: string;
  readonly imageId: string;
  readonly mbid?: string;
  readonly albums: string[];
}

export function createArtistEntity(id: string, name: string, imageId: string, mbid?: string): ArtistEntity {
  return {
    id,
    name,
    imageId,
    mbid,
    albums: []
  };
}
