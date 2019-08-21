import { Action, combineReducers, compose, createFeatureSelector, createSelector, Selector } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as fromAlbums from './albums.reducer';
import * as fromArtists from './artists.reducer';
import * as fromImages from './images.reducer';
import * as ArtistActions from './artists.actions';
import { Dictionary } from '@ngrx/entity';
import { Album } from '../../../models/album';
import { Image, ImageId, ImagesMap } from '../../../models/image';
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
  const artistsImages = fromArtists.getImageIds(state, ids);
  const albumsImages = fromAlbums.getImageIdsByArtistIds(state, ids);
  const newState = combinedReducers(state, action);
  const imagesToDelete = artistsImages.concat(albumsImages);
  return {
    ...newState,
    [fromImages.imagesFeatureKey]: fromImages.removeImages(state[fromImages.imagesFeatureKey], imagesToDelete)
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

export const getArtists: Selector<State, Artist[]> = compose(
  fromArtists.getArtists,
  selectMuslibState
);

export const getImagesMap: Selector<State, ImagesMap> = compose(
  fromImages.getImagesMap,
  selectMuslibState
);

const getAlbums: Selector<State, Album[]> = compose(
  fromAlbums.getAlbums,
  selectMuslibState
);

export const collectImageIds: Selector<State, ImageId[]> = createSelector(
  getArtists,
  getAlbums,
  getImagesMap,
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

export const getArtist = (artistId: string): Selector<State, Artist | undefined> => compose(
  fromArtists.getArtist(artistId),
  selectMuslibState
);

export const getArtistAlbums = (artistId: string): Selector<State, Album[]> => compose(
  fromAlbums.getArtistAlbums(artistId),
  selectMuslibState
);

export const getArtistsLoaded: Selector<State, boolean> = compose(
  fromArtists.getArtistsLoaded,
  selectMuslibState
);
