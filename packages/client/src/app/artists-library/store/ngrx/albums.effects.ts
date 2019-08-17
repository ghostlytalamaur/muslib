import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AlbumsActions from './albums.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { MuslibApi } from '../../../../server/api/server-api';
import { createAlbumEntity } from '../album.entity';

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
    private server: MuslibApi
  ) {
  }

  private loadAlbums(artistId: string): Observable<Action> {
    const mbId = '';
    this.server.mb2.releaseGroups(mbId)
      .pipe(
        map(releaseGroups =>
          releaseGroups.releaseGroups.map(group =>
            createAlbumEntity(group.id, group.title, group.year, '', artistId)
          )
        ),
        map(albums => AlbumsActions.addAlbums({ artistId, albums })),
        catchError(ignored => of(AlbumsActions.loadFailed( {
          artistId,
          message: 'Cannot load albums'
        })))
      );
    return EMPTY;
  }
}
