import { Image } from '../../../models/image';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as ImagesActions from './images.actions';

export const imagesFeatureKey = 'images';

export interface State extends EntityState<Image> {
}

export const adapter: EntityAdapter<Image> = createEntityAdapter<Image>();
const initialState: State = adapter.getInitialState();

export const reducer = createReducer(initialState,
  on(ImagesActions.addImages, (state, { images }) => adapter.addMany(images, state))
);
