import { merge, NEVER, Observable } from 'rxjs';
import { createImage, Image, ImageId, ImageType } from '../../models/image';
import { MuslibApi } from '@muslib/server/api/server-api';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { ImagesFireStorage } from './images-fire-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesStorage {

  constructor(
    private storage: ImagesFireStorage,
    private server: MuslibApi
  ) {
  }

  getImages(ids: ImageId[]): Observable<Image[]> {
    const firebaseIds: string[] = [];
    const coverArtIds: string[] = [];
    for (const id of ids) {
      if (id.type === ImageType.FireStorage) {
        firebaseIds.push(id.id);
      } else {
        coverArtIds.push(id.id);
      }
    }

    return merge(this.storage.getEntities(firebaseIds), this.getCoverArts(coverArtIds));
  }

  private getCoverArts(ids: string[]): Observable<Image[]> {
    const observables = ids.map(id =>
      this.server.mb2.coverArt(id)
        .pipe(
          map(url => createImage(ImageType.CoverArt, id, url)),
          catchError(ignored => NEVER)
        )
    );
    return merge(...observables)
      .pipe(
        map(image => [image])
      );
  }
}
