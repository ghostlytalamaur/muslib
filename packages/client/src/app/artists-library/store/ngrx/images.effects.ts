import { Action, Store } from '@ngrx/store';
import { NEVER, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { createEffect } from '@ngrx/effects';
import * as fromMuslib from './muslib.reducer';
import * as ImagesActions from './images.actions';
import { ImageId } from '../../../models/image';
import { ImagesService } from '../../services/images.service';

export class ImagesEffects {

  loadEffect$ = createEffect(() =>
    this.getImageIds()
      .pipe(
        switchMap(imageIds => this.requestImages(imageIds)),
      )
  );

  constructor(
    private readonly imgService: ImagesService,
    private readonly store: Store<fromMuslib.State>
  ) {
  }

  private getImageIds(): Observable<ImageId[]> {
    return this.store.select(fromMuslib.getImageIds);
  }

  private requestImages(imageIds: ImageId[]): Observable<Action> {
    return this.imgService.getImages(imageIds)
      .pipe(
        map(images => ImagesActions.addImages({ images })),
        catchError(ignored => NEVER)
      );
  }
}
