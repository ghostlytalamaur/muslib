import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AlbumsActions from './albums.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { NEVER, Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { MuslibApi } from '../../../../server/api/server-api';
import { createAlbumEntity } from '../album.entity';
import * as fromMuslib from './muslib.reducer';
import { createImageId, ImageType } from '../../../models/image';

@Injectable()
export class AlbumsEffects {

  loadAlbums$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AlbumsActions.loadAlbums),
        mergeMap(action => this.loadAlbums(action.artistId))
      )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromMuslib.State>,
    private server: MuslibApi
  ) {
  }

  private loadAlbums(artistId: string): Observable<Action> {
    return this.store.select(fromMuslib.getArtist(artistId))
      .pipe(
        switchMap(artist => {
          if (artist && artist.mbid) {
            return this.server.mb2.releaseGroups(artist.mbid)
              .pipe(
                map(releaseGroups =>
                  releaseGroups.releaseGroups.map(group => {
                    const imageId = createImageId(ImageType.CoverArt, group.id);
                    return createAlbumEntity(group.id, group.title, group.year, imageId, artistId);
                  })
                ),
                map(albums => AlbumsActions.addAlbums({ artistId, albums })),
                catchError(ignored => of(AlbumsActions.loadFailed({
                  artistId,
                  message: 'Cannot load albums'
                })))
              );
          } else {
            return NEVER;
          }
        })
      );
  }
}
