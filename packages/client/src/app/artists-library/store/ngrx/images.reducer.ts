import { Image, ImageId } from '../../../models/image';
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

export function removeImages(state: State, ids: ImageId[]): State {
  return adapter.removeMany(ids.map(imageId => imageId.id), state);
}


export const {
  selectEntities: getImagesEntitiesMap,
  selectAll: getImages,
  selectTotal: getTotalImages,
  selectIds: getImagesIds
} = adapter.getSelectors();
