import { createAction, props } from '@ngrx/store';
import { AlbumEntity } from '../album.entity';

export const addAlbums = createAction(
  '[Albums] Add Albums',
  props<{ artistId: string; albums: AlbumEntity[] }>()
);
