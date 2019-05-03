import {AuthService} from '../../auth/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {Album} from '../../models/album';
import {CompletionObserver, from, Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {StatusService} from '../../services/status.service';

export class BaseService<T, R> {
  constructor(
    private readonly statusService: StatusService,
    protected readonly authService: AuthService,
    protected readonly fireStore: AngularFirestore,
    protected readonly fireStorage: AngularFireStorage
  ) {
  }

  private static getImageId(userId: string, path: string, docId: string): string {
    return `users/${userId}/${path}/${docId}/${docId}_main`;
  }

  protected addItem(path: string, item: T, image: File): Promise<string> {
    return this.getUserId()
      .then(userId => {
        const id = this.fireStore.createId();
        return this.uploadFile(this.fireStorage, BaseService.getImageId(userId, path, id), image)
          .then(() =>
            this.fireStore.collection<T>(`users/${userId}/${path}`)
              .doc<T>(id)
              .set(item)
              .then(() => Promise.resolve(id))
          );
      });
  }

  protected deleteItem(path: string, id: string): Promise<void> {
    return this.getUserId()
      .then((userId) =>
        this.fireStore.collection<Album>(`users/${userId}/path`).doc(id).delete());
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
              const image$ = this.getImageUrl(this.fireStorage, `users/${user.uid}/${path}/${id}/${id}_main`);
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
    // return storage.ref(path).getDownloadURL().pipe(
    const urlPromise = storage.storage.ref(path).getDownloadURL()
      .catch(() => Promise.resolve(''));
    return from(urlPromise).pipe(
      //   return storage.ref(path).getDownloadURL().pipe(
      catchError(() => of(''))
    );
  }

  private uploadFile(storage: AngularFireStorage, path: string, file: File): Promise<void> {
    if (file) {
      const progressObserver: CompletionObserver<number> = {
        complete: () => this.statusService.endOperation()
      };

      this.statusService.startOperation();
      const task = storage.ref(path).put(file);
      task.percentageChanges().subscribe(progressObserver);
      return task.then();
    } else {
      return Promise.resolve();
    }
  }

}
