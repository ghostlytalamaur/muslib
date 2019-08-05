import { from, Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesStorage {

  constructor(
    private readonly fireStorage: AngularFireStorage
  ) {}

  getImageUrl(id: string): Observable<string> {
    const imagePromise = this.fireStorage.storage
      .ref(id)
      .getDownloadURL()
      .catch(() => Promise.resolve(''));
    return fromPromise(imagePromise);
  }

}
