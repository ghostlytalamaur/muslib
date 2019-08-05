import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MuslibApi } from 'src/server/api/server-api';
import { AuthService } from '../../auth/auth.service';
import { IdHolder } from '../../models/id-holder';
import { StatusService } from '../../services/status.service';

export class BaseService<T, R> {
  constructor(
    private readonly statusService: StatusService,
    private readonly server: MuslibApi,
    protected readonly authService: AuthService,
    protected readonly fireStore: AngularFirestore,
    protected readonly fireStorage: AngularFireStorage
  ) {}

  private static getImageId(
    userId: string,
    path: string,
    docId: string,
    size: string
  ): string {
    return `users/${userId}/${path}/${docId}/${docId}_${size}`;
  }

  protected async updateItem(
    path: string,
    item: Partial<T> & IdHolder
  ): Promise<void> {
    const userId = await this.getUserId();
    return this.fireStore
      .collection<T>(`users/${userId}/${path}`)
      .doc<T>(item.id)
      .update(item);
  }

  protected async addItem(
    path: string,
    item: T,
    image: File | string | undefined
  ): Promise<string> {
    const userId = await this.getUserId();
    const id = this.fireStore.createId();
    if (image) {
      await this.uploadFile(`${path}/${id}`, image);
    }

    await this.fireStore
      .collection<T>(`users/${userId}/${path}`)
      .doc<T>(id)
      .set(item);
    return id;
  }

  protected async deleteItem(path: string, id: string): Promise<void> {
    const userId = await this.getUserId();
    return this.fireStore
      .collection<T>(`users/${userId}/${path}`)
      .doc(id)
      .delete();
  }

  protected getItems(
    path: string,
    size: number,
    factory: (id: string, data: T, image: string) => R
  ): Observable<R[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.fireStore
            .collection<T>(`users/${user.uid}/${path}`)
            .snapshotChanges()
            .pipe(
              map(changes =>
                changes.map(change => {
                  const id = change.payload.doc.id;
                  const data = change.payload.doc.data();
                  const imageId = BaseService.getImageId(user.uid, path, id, size.toString());
                  return factory(id, data, imageId);
                })
              )
            );
        } else {
          return of([]);
        }
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

  private async getImageUrl(
    storage: AngularFireStorage,
    path: string
  ): Promise<string> {
    return storage.storage
      .ref(path)
      .getDownloadURL()
      .catch(() => Promise.resolve(''));
  }

  private uploadFile(path: string, image: File | string): Promise<void> {
    if (image instanceof File) {
      return this.server.upload.image(path, image);
    } else {
      return this.server.upload.url(path, image);
    }
  }
}
