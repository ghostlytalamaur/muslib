import { ImageId } from '../../models/image';

export interface ArtistEntity {
  readonly id: string;
  readonly name: string;
  readonly imageId: ImageId;
  readonly mbid?: string;
  readonly albums: string[];
}

export function createArtistEntity(id: string, name: string, imageId: ImageId, mbid?: string): ArtistEntity {
  return {
    id,
    name,
    imageId,
    mbid,
    albums: []
  };
}
