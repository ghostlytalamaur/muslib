import { ImageId } from './image';

export enum AlbumType {
  Regular,
  Favorite
}
export interface Album {
  readonly type: AlbumType;
  readonly id: string;
  readonly title: string;
  readonly year: number;
  readonly image: ImageId | undefined;
  readonly artistId: string;
}

export function createAlbum(id: string, title: string, year: number, imageId: ImageId | undefined, artistId: string): Album {
  return {
    type: AlbumType.Regular, id, title, year, image: imageId, artistId
  };
}
