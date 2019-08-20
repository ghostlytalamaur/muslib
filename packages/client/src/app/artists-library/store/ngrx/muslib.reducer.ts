import { Action, combineReducers, compose, createFeatureSelector, createSelector, Selector } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as fromAlbums from './albums.reducer';
import * as fromArtists from './artists.reducer';
import * as fromImages from './images.reducer';
import * as ArtistActions from './artists.actions';
import { Dictionary } from '@ngrx/entity';
import { Album } from '../../../models/album';
import { Image, ImageId } from '../../../models/image';
import { Artist } from '../../../models/artist';

export const muslibFeatureKey = 'library';

interface MuslibState {
  [fromArtists.artistFeatureKey]: fromArtists.State;
  [fromAlbums.albumsFeatureKey]: fromAlbums.State;
  [fromImages.imagesFeatureKey]: fromImages.State;
}

export interface State extends fromRoot.State {
  [muslibFeatureKey]: MuslibState;
}

function combinedReducers(state: MuslibState | undefined, action: Action): MuslibState {
  return combineReducers({
    [fromArtists.artistFeatureKey]: fromArtists.reducer,
    [fromAlbums.albumsFeatureKey]: fromAlbums.reducer,
    [fromImages.imagesFeatureKey]: fromImages.reducer
  })(state, action);
}

function artistsDeleted(state: MuslibState, action: ArtistActions.ArtistsDeleted): MuslibState {
  const { ids } = action;
  const artistsImages = fromArtists.getImageIds(getArtistState(state), ids);
  const albumsImages = fromAlbums.getImageIdsByArtistIds(getAlbumsState(state), ids);
  const newState = combinedReducers(state, action);
  const imagesToDelete = artistsImages.concat(albumsImages);
  return {
    ...newState,
    [fromImages.imagesFeatureKey]: fromImages.removeImages(getImagesState(state), imagesToDelete)
  };
}

export function reducer(state: MuslibState, action: ArtistActions.Actions): MuslibState {
  switch (action.type) {
    case ArtistActions.artistsDeleted.type:
      return artistsDeleted(state, action);
    default:
      return combinedReducers(state, action);
  }
}

const selectMuslibState: Selector<State, MuslibState> = createFeatureSelector<State, MuslibState>(muslibFeatureKey);
function getArtistState(state: MuslibState): fromArtists.State {
  return state[fromArtists.artistFeatureKey];
}

const selectArtistState: Selector<State, fromArtists.State> = compose(
  getArtistState,
  selectMuslibState
);

function getAlbumsState(state: MuslibState): fromAlbums.State {
  return state[fromAlbums.albumsFeatureKey];
}

const selectAlbumsState: Selector<State, fromAlbums.State> = compose(
  getAlbumsState,
  selectMuslibState
);

function getImagesState(state: MuslibState): fromImages.State {
  return state[fromImages.imagesFeatureKey];
}

const selectImagesState: Selector<State, fromImages.State> = compose(
  getImagesState,
  selectMuslibState
);

export const getArtists: Selector<State, Artist[]> = compose(
  fromArtists.getArtists,
  selectArtistState
);

const getImagesEntitiesMap: Selector<State, Dictionary<Image>> = compose(
  fromImages.getImagesEntitiesMap,
  selectImagesState
);

const getAlbumsEntities: Selector<State, Album[]> = compose(
  fromAlbums.getAlbumsEntities,
  selectAlbumsState
);

export const collectImageIds: Selector<State, ImageId[]> = createSelector(
  getArtists,
  getAlbumsEntities,
  getImagesEntitiesMap,
  (artistsEntities, albumEntities, images) => {
    const isImageLoaded = (map: Dictionary<Image>, image: ImageId): boolean => {
      const img = map[image.id];
      return !!(img && img.url);
    };
    const ids: ImageId[] = [];
    for (const entity of artistsEntities) {
      if (entity.image && !isImageLoaded(images, entity.image)) {
        ids.push(entity.image);
      }
    }

    for (const entity of albumEntities) {
      if (entity.image && !isImageLoaded(images, entity.image)) {
        ids.push(entity.image);
      }
    }
    return ids;
  }
);

export const getArtist: (artistId: string) => Selector<State, Artist | undefined> = artistId =>
  createSelector(
    selectArtistState,
    state => fromArtists.getArtist(state, artistId)
  );

export const getArtistAlbums = (artistId: string): Selector<State, Album[]> => createSelector(
  getAlbumsEntities,
  albumEntities => fromAlbums.getAlbumsEntitiesByArtistId(albumEntities, artistId)
);

export const getArtistsLoaded: Selector<State, boolean> = createSelector(
  selectArtistState,
  state => state.loaded
);


const selectMuslibState2 = createFeatureSelector<MuslibState>(muslibFeatureKey);

const selectArtistState2 = createSelector(
  selectMuslibState2,
  state => state[fromArtists.artistFeatureKey]
);


export const getArtistsLoaded2 = createSelector(
  selectArtistState2,
  state => state.loaded
);
