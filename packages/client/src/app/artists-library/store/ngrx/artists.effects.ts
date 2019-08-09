import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ArtistsActions from './artists.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ArtistsStorageService } from '../../services/artists-storage.service';
import { merge, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class ArtistsEffects {

  loadEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(ArtistsActions.loadArtists),
        switchMap(() => this.getArtistsChangesAction())
      )
  );

  constructor(
    private actions$: Actions,
    private readonly artistsStorage: ArtistsStorageService
  ) {
  }

  private getArtistsChangesAction(): Observable<Action> {
    return merge(
      // this.loadArtists(),
      this.getAddedArtists(),
      this.getModifiedArtists(),
      this.getDeletedArtists()
    );
  }

  private loadArtists(): Observable<Action> {
    return this.artistsStorage.loadEntities()
      .pipe(
        map(entities => ArtistsActions.setArtists({ artists: entities })),
        tap(entities => console.log('Artists Loaded', entities)),
        catchError((err: Error) => of(ArtistsActions.setError({ message: err.message })))
      );
  }

  private getAddedArtists(): Observable<Action> {
    return this.artistsStorage.addedEntities()
      .pipe(
        map(entities => ArtistsActions.artistsAdded({ artists: entities })),
        tap(entities => console.log('Artists added', entities)),
        catchError((err: Error) => of(ArtistsActions.setError({ message: err.message })))
      );
  }

  private getModifiedArtists(): Observable<Action> {
    return this.artistsStorage.modifiedEntities()
      .pipe(
        map(entities => ArtistsActions.artistsModified({ artists: entities })),
        tap(entities => console.log('Artists modified', entities)),
        catchError((err: Error) => of(ArtistsActions.setError({ message: err.message })))
      );
  }

  private getDeletedArtists(): Observable<Action> {
    return this.artistsStorage.deletedEntities()
      .pipe(
        map(ids => ArtistsActions.artistsDeleted({ ids })),
        tap(ids => console.log('Artists deleted', ids)),
        catchError((err: Error) => of(ArtistsActions.setError({ message: err.message })))
      );
  }
}
