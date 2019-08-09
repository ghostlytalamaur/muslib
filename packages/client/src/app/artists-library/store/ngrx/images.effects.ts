import { ImagesStorage } from '../../services/images-storage.service';
import { Action, Store } from '@ngrx/store';
import { NEVER, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { createEffect } from '@ngrx/effects';
import * as fromMuslib from './muslib.reducer';
import * as ImagesActions from './images.actions';

export class ImagesEffects {

  loadEffect$ = createEffect(() =>
    this.getImageIds()
      .pipe(
        switchMap(imageIds => this.requestImages(imageIds)),
      )
  );

  constructor(
    private readonly imgStorage: ImagesStorage,
    private readonly store: Store<fromMuslib.State>
  ) {
  }

  private getImageIds(): Observable<string[]> {
    return this.store.select(fromMuslib.getImageIds);
  }

  private requestImages(imageIds: string[]): Observable<Action> {
    return this.imgStorage.getEntities(imageIds)
      .pipe(
        map(images => ImagesActions.addImages({ images })),
        catchError(ignored => NEVER)
      );
  }
}
