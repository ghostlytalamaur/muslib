import { createAction, props } from '@ngrx/store';
import { ArtistEntity } from '../artist.entity';

export const loadArtists = createAction(
  '[Artists] Load Artists'
);

export const setArtists = createAction(
  '[Artists] Set Artists',
  props<{ artists: ArtistEntity[] }>()
);

export const addArtist = createAction(
  '[Artists] Add Artists',
  props<{ artists: ArtistEntity }>()
);

export const updateArtists = createAction(
  '[Artists] Update Artists',
  props<{ artists: ArtistEntity[] }>()
);

export const deleteArtists = createAction(
  '[Artists] Delete Artists',
  props<{ ids: string[] }>()
);

export const artistsAdded = createAction(
  '[Artists] Artists Added',
  props<{ artists: ArtistEntity[] }>()
);

export const artistsModified = createAction(
  '[Artists] Artists Modified',
  props<{ artists: ArtistEntity[] }>()
);

export const artistsDeleted = createAction(
  '[Artists] Artists Deleted',
  props<{ ids: string[] }>()
);

export const setError = createAction(
  '[Artists] Set Error',
  props<{ message: string }>()
);
