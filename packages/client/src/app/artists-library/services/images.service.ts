import { ImagesStore } from '../store/images.store';
import { ImagesStorage } from './images-storage.service';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ImagesQuery } from '../store/images.query';
import { createImage, Image, ImageType } from '../../models/image';
import { MuslibApi } from '../../../server/api/server-api';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(
    private storage: ImagesStorage,
    private readonly store: ImagesStore,
    private readonly query: ImagesQuery,
    private readonly server: MuslibApi
  ) {
  }

  private loadImage(type: ImageType, id: string): Observable<Image> {
    let img$: Observable<string>;
    switch (type) {
      case ImageType.FireStorage:
        img$ = this.storage.getImageUrl(id);
        break;
      case ImageType.CoverArt:
        img$ = this.server.mb2.coverArt(id);
        break;
      default:
        img$ = of('');
        break;
    }
    return img$
      .pipe(
        catchError(ignored => ''),
        map(url => createImage(type, id, url)),
      );
  }

  loadImages(type: ImageType, ...ids: string[]): void {
    setTimeout(() => {
      this.store.add(createImage(ImageType.CoverArt, 'test-image-id', ''));
    }, 5000);
    forkJoin(ids.map(id => this.loadImage(type, id)))
      .subscribe((images: Image[]) => {
        this.store.add(images);
      });
  }

}
