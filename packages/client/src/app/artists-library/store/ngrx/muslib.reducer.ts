import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as fromAlbums from './albums.reducer';
import * as fromArtists from './artists.reducer';
import * as fromImages from './images.reducer';
import { Dictionary } from '@ngrx/entity';
import { Album } from '../../../models/album';
import { Artist } from '../../../models/artist';
import { ImageId } from '../../../models/image';

export const muslibFeatureKey = 'library';

interface MuslibState {
  [fromArtists.artistFeatureKey]: fromArtists.State;
  [fromAlbums.albumsFeatureKey]: fromAlbums.State;
  [fromImages.imagesFeatureKey]: fromImages.State;
}

export interface State extends fromRoot.State {
  [muslibFeatureKey]: MuslibState;
}

export function reducer(state: MuslibState | undefined, action: Action): MuslibState {
  return combineReducers({
    [fromArtists.artistFeatureKey]: fromArtists.reducer,
    [fromAlbums.albumsFeatureKey]: fromAlbums.reducer,
    [fromImages.imagesFeatureKey]: fromImages.reducer
  })(state, action);
}

const selectMuslibState = createFeatureSelector<MuslibState>(muslibFeatureKey);

const selectArtistState = createSelector(
  selectMuslibState,
  state => state[fromArtists.artistFeatureKey]
);

const selectAlbumsState = createSelector(
  selectMuslibState,
  state => state[fromAlbums.albumsFeatureKey]
);

const selectImagesState = createSelector(
  selectMuslibState,
  state => state[fromImages.imagesFeatureKey]
);

const {
  selectAll: getArtists,
  selectIds: getArtistsIds,
  selectTotal: getTotalArtists,
  selectEntities: getArtistEntitiesMap
} = fromArtists.adapter.getSelectors(selectArtistState);

const {
  selectEntities: getAlbumsEntitiesMap,
  selectAll: getAlbumsEntities,
  selectIds: getAlbumsIds,
  selectTotal: getTotalAlbums
} = fromAlbums.adapter.getSelectors(selectAlbumsState);

export const {
  selectEntities: getImagesEntitiesMap,
  selectAll: getImages,
  selectTotal: getTotalImages,
  selectIds: getImagesIds
} = fromImages.adapter.getSelectors(selectImagesState);

const getArtistEntity = (artistId: string) => createSelector(
  getArtistEntitiesMap,
  entities => entities[artistId]
);

const getAlbumsEntitiesByIds = (albumsEntities: Dictionary<Album>, ids: string[]) =>
  ids.map(id => albumsEntities[id]);

const getAlbumsEntitiesByArtistId = (albumsEntities: Album[], artistId: string) =>
  albumsEntities.filter(entity => entity.artistId === artistId);

export const collectImageIds = createSelector(
  getArtists,
  getAlbumsEntities,
  (artistsEntities, albumEntities) => {
    const ids: ImageId[] = [];
    for (const entity of artistsEntities) {
      if (entity.image) {
        ids.push(entity.image);
      }
    }

    for (const entity of albumEntities) {
      if (entity.image) {
        ids.push(entity.image);
      }
    }
    return ids;
  }
);

export const getArtist = (artistId: string) => createSelector(
  getArtistEntitiesMap,
  (artistsMap: Dictionary<Artist>) => {
    return artistsMap[artistId];
  }
);

export const getArtistAlbums = (artistId: string) => createSelector(
  getAlbumsEntities,
  (albumEntities: Album[]) =>
    getAlbumsEntitiesByArtistId(albumEntities, artistId)
);

export const getArtistsLoaded = createSelector(
  selectArtistState,
  state => state.loaded
);

export { getArtists };
