import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { CompletionObserver, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { StatusService } from '../../services/status.service';

export class BaseService<T, R> {
  constructor(
    private readonly statusService: StatusService,
    private readonly http: HttpClient,
    protected readonly authService: AuthService,
    protected readonly fireStore: AngularFirestore,
    protected readonly fireStorage: AngularFireStorage
  ) {
  }

  private static getImageId(userId: string, path: string, docId: string, size: string): string {
    return `users/${userId}/${path}/${docId}/${docId}_${size}`;
  }

  protected async addItem(path: string, item: T, image: File): Promise<string> {
    const userId = await this.getUserId();
    const id = this.fireStore.createId();
    if (image) {
      await this.uploadFile2(this.fireStorage, `${path}/${id}`, image);
    }

    await this.fireStore.collection<T>(`users/${userId}/${path}`).doc<T>(id).set(item);
    return Promise.resolve(id);
  }

  protected async deleteItem(path: string, id: string): Promise<void> {
    const userId = await this.getUserId();
    return await this.fireStore.collection<T>(`users/${userId}/${path}`).doc(id).delete();
  }

  protected getItems(path: string, factory: (id: string, data: T, image$: Observable<string>) => R): Observable<R[]> {
    console.log(this);
    return this.authService.user$.pipe(
      switchMap(user => {
        return this.fireStore.collection<T>(`users/${user.uid}/${path}`).snapshotChanges()
          .pipe(
            map(changes => changes.map(change => {
              const id = change.payload.doc.id;
              const data = change.payload.doc.data();
              const image$ = this.getImageUrl(this.fireStorage, BaseService.getImageId(user.uid, path, id, '300'));
              return factory(id, data, image$);
            }))
          );
      })
    );
  }

  private getUserId(): Promise<string> {
    const user = this.authService.user;
    if (user) {
      return Promise.resolve(user.uid);
    } else {
      return Promise.reject(new Error('Authorization required.'));
    }
  }

  private getImageUrl(storage: AngularFireStorage, path: string): Observable<string> {
    const urlPromise = storage.storage.ref(path).getDownloadURL()
      .catch(() => Promise.resolve(''));
    return from(urlPromise).pipe(
      catchError(() => of(''))
    );
  }

  private static async readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent) => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Reader result must be a ArrayBuffer.'));
        }
      };
      reader.onloadend = (ev: ProgressEvent) => {
        if (ev.loaded != ev.total) {
          reject(new Error('Not all content can be readed.'));
        }
      }

      reader.readAsArrayBuffer(file);
    });
  }

  private async uploadFile2(storage: AngularFireStorage, path: string, file: File): Promise<void> {
    const content = await BaseService.readFile(file);
    const url = environment.server.url + '/images/' + path;
    try {
      await this.http.post(url, content, { headers: { 'Content-Type': file.type }, responseType: 'arraybuffer' })
        .pipe(
          take(1)
        )
        .toPromise();
    }
    catch (err) {
      console.log('Error while uploading file\n', err)
    }
  }

}
