export enum ImageType {
  FireStorage,
  CoverArt
}

export type ImageSize = 'thumb300';
export type ImageThumbnails = Record<ImageSize, string>;
export interface Image {
  readonly type: ImageType;
  readonly id: string;
  readonly url: string;
  readonly thumbnails?: ImageThumbnails;
}

export function createImage(type: ImageType, id: string, url: string, thumbnails?: ImageThumbnails): Image {
  return {
    type,
    id,
    url,
    thumbnails
  };
}
