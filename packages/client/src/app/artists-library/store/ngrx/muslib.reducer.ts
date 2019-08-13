import { Action, combineReducers, createFeatureSelector, createSelector } from '@ngrx/store';

import { createArtist } from '../../../models/artist';
import * as fromRoot from '../../../reducers';
import * as fromAlbums from './albums.reducer';
import * as fromArtists from './artists.reducer';
import * as fromImages from './images.reducer';
import { Album, createAlbum } from '../../../models/album';
import { Dictionary } from '@ngrx/entity';
import { AlbumEntity } from '../album.entity';
import { ArtistEntity } from '../artist.entity';
import { Image } from '../../../models/image';

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
  selectAll: getArtistsEntities,
  selectIds: getArtistsIds,
  selectTotal: getTotalArtists,
  selectEntities: getArtistEntitiesMap
} = fromArtists.adapter.getSelectors(selectArtistState);

const {
  selectEntities: getAlbumsEntitiesMap,
  selectAll: getAllAlbumsEntities,
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

const getAlbumsEntitiesByIds = (albumsEntities: Dictionary<AlbumEntity>, ids: string[]) =>
  ids.map(id => albumsEntities[id]);

const getArtistAlbumsEntities = (artistId: string) => createSelector(
  getArtistEntity(artistId),
  getAlbumsEntitiesMap,
  (artistEntity: ArtistEntity, albumsMap: Dictionary<AlbumEntity>) =>
    artistEntity ? getAlbumsEntitiesByIds(albumsMap, artistEntity.albums) : undefined
);

export const getImageIds = createSelector(
  getArtistsEntities,
  entities => {
    const ids: string[] = [];
    for (const entity of entities) {
      if (entity.imageId) {
        ids.push(entity.imageId);
      }
    }
    return ids;
  }
);

function getImageUrl(images: Dictionary<Image>, id: string): string {
  const image = images[id];
  if (image) {
    if (image.thumbnails && image.thumbnails.thumb300) {
      return image.thumbnails.thumb300;
    } else {
      return image.url;
    }
  }
  return '';
}

export const getArtists = createSelector(
  getArtistsEntities,
  getImagesEntitiesMap,
  (artists: ArtistEntity[], images: Dictionary<Image>) =>
    artists.map(a => createArtist(a.id, a.name, getImageUrl(images, a.imageId), a.mbid))
);

export const getArtist = (artistId: string) => createSelector(
  getArtistEntitiesMap,
  getImagesEntitiesMap,
  (artistsMap: Dictionary<ArtistEntity>, images: Dictionary<Image>) => {
    const artistEntity = artistsMap[artistId];
    if (!artistEntity) {
      return undefined;
    }

    return createArtist(artistEntity.id, artistEntity.name, getImageUrl(images, artistEntity.imageId), artistEntity.mbid);
  }
);

export const getArtistAlbums = (artistId: string) => createSelector(
  getArtistAlbumsEntities(artistId),
  getImagesEntitiesMap,
  (albums, images) => {
    if (albums) {
      return albums.reduce<Album[]>((arr, album) => {
        if (album) {
          const image = images[album.imageId];
          arr.push(createAlbum(album.id, album.title, album.year, image ? image.url : '', artistId));
        }
        return arr;
      }, []);
    } else {
      return [];
    }
  }
);

export const getArtistsLoaded = createSelector(
  selectArtistState,
  state => state.loaded
);
