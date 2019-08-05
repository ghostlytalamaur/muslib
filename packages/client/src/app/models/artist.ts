export interface Artist {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
  readonly mbid?: string;
}

export type PartialArtist = { id: string } & Partial<Artist>;

export function createArtist(id: string, name: string, imageUrl: string, mbid?: string): Artist {
  return {
    id,
    name,
    imageUrl,
    mbid
  };
}
