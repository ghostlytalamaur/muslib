export enum ImageType {
  FireStorage,
  CoverArt
}

export interface ImageId {
  readonly type: ImageType;
  readonly id: string;
}

type ImageSize = 'thumb300';
export type ImageThumbnails = Record<ImageSize, string>;

export interface Image extends ImageId {
  readonly url: string;
  readonly thumbnails?: ImageThumbnails;
}

export interface ImagesMap {
  [id: string]: Image | undefined;
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

export function getImageUrlFromMap(images: ImagesMap, image: ImageId | undefined): string {
  if (images && image) {
    return getImageUrl(images[image.id]);
  } else {
    return '';
  }
}

export function getImageUrl(image: Image | undefined): string {
  if (image) {
    if (image.thumbnails && image.thumbnails.thumb300) {
      return image.thumbnails.thumb300;
    } else {
      return image.url;
    }
  } else {
    return '';
  }
}
