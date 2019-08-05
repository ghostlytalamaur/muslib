import { createAction, props } from '@ngrx/store';
import { ArtistEntity } from '../artist.entity';

export const setArtists = createAction(
  '[Artists] Set Artists',
  props<{ artists: ArtistEntity[] }>()
);
