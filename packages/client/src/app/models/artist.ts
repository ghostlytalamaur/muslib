import { ImageId } from './image';

export interface Artist {
  readonly id: string;
  readonly name: string;
  readonly image: ImageId | undefined;
  readonly mbid?: string;
  readonly albums: string[];
}

export function createArtist(id: string, name: string, imageId: ImageId | undefined, mbid?: string): Artist {
  return {
    id,
    name,
    image: imageId,
    mbid,
    albums: []
  };
}
