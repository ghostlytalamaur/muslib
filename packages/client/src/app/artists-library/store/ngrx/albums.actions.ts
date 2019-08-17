import { createAction, props } from '@ngrx/store';
import { AlbumEntity } from '../album.entity';

export const loadAlbums = createAction(
  '[Albums] Load Albums',
  props<{ artistId: string }>()
);

export const loadFailed = createAction(
  '[Albums] Load Failed',
  props<{ artistId: string, message: string }>()
);

export const addAlbums = createAction(
  '[Albums] Add Albums',
  props<{ artistId: string; albums: AlbumEntity[] }>()
);
