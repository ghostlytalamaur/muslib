import { AngularFirestore, DocumentChangeAction, Query } from '@angular/fire/firestore';
import { AuthService } from '../../../auth/auth.service';
import { NEVER, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { User } from '../../../auth/user';

export abstract class FireEntityService<Entity, EntityData> {

  protected constructor(
    private readonly afs: AngularFirestore,
    protected readonly authService: AuthService,
    private readonly collection: string
  ) {
  }

  addedEntities(): Observable<Entity[]> {
    return this.changedEntities('added');
  }

  modifiedEntities(): Observable<Entity[]> {
    return this.changedEntities('modified');
  }

  deletedEntities(): Observable<string[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.deletedEntitiesForUser(user) : NEVER)
      );
  }

  loadEntities(): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.loadEntitiesForUser(user) : of([])),
        take(1)
      );
  }

  getEntities(ids: string[]): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.getEntitiesForUser(ids, user) : of([]))
      );
  }

  async deleteEntity(id: string): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      return this.afs
        .collection<EntityData>(this.getCollectionPath(user.uid))
        .doc(id)
        .delete();
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  protected async updateEntity(id: string, entityData: Partial<EntityData>): Promise<void> {
    const user = this.authService.user;
    if (user) {
      return this.afs.collection<EntityData>(this.getCollectionPath(user.uid))
        .doc(id)
        .update(entityData);
    }
  }

  protected async addEntities(entities: EntityData[]): Promise<void> {
    const user = this.authService.user;
    if (user) {
      const promises: Promise<void>[] = [];
      const collection = this.getCollectionPath(user.uid);
      for (const entity of entities) {
        const res = this.afs.collection<EntityData>(collection)
          .add(entity)
          .then(() => {
          });
        promises.push(res);
      }
      return Promise.all(promises).then(() => {
      });
    }
  }

  protected async addEntity(entityData: EntityData): Promise<string> {
    const user = this.authService.user;
    if (user) {
      return this.afs.collection<EntityData>(this.getCollectionPath(user.uid))
        .add(entityData)
        .then(docRef => docRef.id);
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  protected abstract createEntity(userId: string, id: string, data: EntityData): Entity | Promise<Entity>;

  private changedEntities(type: 'added' | 'modified'): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.changedEntitiesForUser(user, type) : NEVER)
      );
  }

  private loadEntitiesForUser(user: User): Observable<Entity[]> {
    const action$ = this.afs.collection<EntityData>(this.getCollectionPath(user.uid)).snapshotChanges();
    return this.createEntitiesForUser(user, action$);
  }

  private changedEntitiesForUser(user: User, type: 'added' | 'modified'): Observable<Entity[]> {
    const action$ = this.afs.collection<EntityData>(this.getCollectionPath(user.uid)).stateChanges([type]);
    return this.createEntitiesForUser(user, action$);
  }

  private createEntitiesForUser(user: User, action$: Observable<DocumentChangeAction<EntityData>[]>): Observable<Entity[]> {
    return action$
      .pipe(
        switchMap(changes => {
          return Promise.all(
            changes.map(doc => {
              const id = doc.payload.doc.id;
              const data = doc.payload.doc.data();
              const entity = this.createEntity(user.uid, id, data);
              if (entity instanceof Promise) {
                return entity;
              } else {
                return Promise.resolve(entity);
              }
            })
          );
        })
      );
  }

  private deletedEntitiesForUser(user: User): Observable<string[]> {
    return this.afs.collection<EntityData>(this.getCollectionPath(user.uid)).stateChanges(['removed'])
      .pipe(
        map(changes => changes.map(change => change.payload.doc.id))
      );
  }

  private getEntitiesForUser(ids: string[], user: User): Observable<Entity[]> {
    const query = (ref: Query) => ref.where('id', 'array-contains', ids);
    const action$ = this.afs.collection<EntityData>(this.getCollectionPath(user.uid), query).snapshotChanges();
    return this.createEntitiesForUser(user, action$);
  }

  private getCollectionPath(userId: string): string {
    return `users/${userId}/${this.collection}`;
  }

}
