import { ImageId } from '../../models/image';

export enum AlbumType {
  Regular,
  Favorite
}
export interface AlbumEntity {
  readonly type: AlbumType;
  readonly id: string;
  readonly title: string;
  readonly year: number;
  readonly imageId: ImageId;
  readonly artistId: string;
}

export function createAlbumEntity(id: string, title: string, year: number, imageId: ImageId, artistId: string): AlbumEntity {
  return {
    type: AlbumType.Regular, id, title, year, imageId, artistId
  };
}
