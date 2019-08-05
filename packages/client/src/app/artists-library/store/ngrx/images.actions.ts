import { createAction, props } from '@ngrx/store';
import { Image } from '../../../models/image';

export const addImages = createAction(
  '[Images] Add Images',
  props<{ images: Image[] }>()
);
