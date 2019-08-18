import { createAction, props } from '@ngrx/store';
import { Artist } from '../../../models/artist';

export const loadArtists = createAction(
  '[Artists] Load Artists'
);

export const setArtists = createAction(
  '[Artists] Set Artists',
  props<{ artists: Artist[] }>()
);

export const addArtist = createAction(
  '[Artists] Add Artists',
  props<{ artists: Artist }>()
);

export const updateArtists = createAction(
  '[Artists] Update Artists',
  props<{ artists: Artist[] }>()
);

export const deleteArtists = createAction(
  '[Artists] Delete Artists',
  props<{ ids: string[] }>()
);

export const artistsAdded = createAction(
  '[Artists] Artists Added',
  props<{ artists: Artist[] }>()
);

export const artistsModified = createAction(
  '[Artists] Artists Modified',
  props<{ artists: Artist[] }>()
);

export const artistsDeleted = createAction(
  '[Artists] Artists Deleted',
  props<{ ids: string[] }>()
);

export const setError = createAction(
  '[Artists] Set Error',
  props<{ message: string }>()
);
