export enum ImageType {
  FireStorage,
  CoverArt
}

export interface ImageId {
  readonly type: ImageType,
  readonly id: string
}

type ImageSize = 'thumb300';
export type ImageThumbnails = Record<ImageSize, string>;

export interface Image extends ImageId {
  readonly url: string;
  readonly thumbnails?: ImageThumbnails;
}

export function createImageId(type: ImageType, id: string): ImageId {
  return { type, id };
}

export function createImage(type: ImageType, id: string, url: string, thumbnails?: ImageThumbnails): Image {
  return {
    type,
    id,
    url,
    thumbnails
  };
}
