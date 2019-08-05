export enum ImageType {
  FireStorage,
  CoverArt
}
export interface Image {
  readonly type: ImageType;
  readonly id: string;
  readonly url: string;
}

export function createImage(type: ImageType, id: string, url: string): Image {
  return {
    type,
    id,
    url
  };
}
