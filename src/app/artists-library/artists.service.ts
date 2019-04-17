import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Artist} from '../lastfm/models/artist';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

const ARTISTS_COLLECTION = 'artists';

@Injectable()
export class ArtistsService {

  constructor(
    private http: HttpClient,
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
  }

  private static getImageId(id: string) {
    return `${ARTISTS_COLLECTION}/${id}/${id}_main`;
  }

  getArtists(): Observable<Artist[]> {
    return this.fireStore.collection<Artist>(ARTISTS_COLLECTION).snapshotChanges().pipe(
      map((change) => {
        return change.map((docChange) => {
          const doc = docChange.payload.doc;
          const data = doc.data();

          const image$ = this.storage.ref(ArtistsService.getImageId(doc.id)).getDownloadURL().pipe(
            catchError((): Observable<string> => of(''))
          );

          return new Artist(doc.id, data.name, image$);
        });
      })
    );
  }

  deleteArtist(docId: string): Promise<void> {
    return this.fireStore.collection<Artist>(ARTISTS_COLLECTION).doc(docId).delete();
  }

  addArtist(name: string, image?: File): Promise<string> {
    const docId = this.fireStore.createId();
    return this.uploadImage(docId, image)
      .then(
        () => {
          const docRef = this.fireStore.collection<Artist>(ARTISTS_COLLECTION).doc(docId);
          return docRef.set({name})
            .then(() => Promise.resolve(docId));
        }
      );
  }

  private uploadImage(docId: string, image: File): Promise<void> {
    if (!image) {
      return Promise.resolve(undefined);
    }

    const fileRef = this.storage.ref(ArtistsService.getImageId(docId));
    return fileRef.put(image).then();
  }
}
