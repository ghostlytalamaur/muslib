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
import { Image, ImageId } from '../../../models/image';

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

const getAlbumsEntitiesByIds = (albumsEntities: Dictionary<AlbumEntity>, ids: string[]) =>
  ids.map(id => albumsEntities[id]);

const getAlbumsEntitiesByArtistId = (albumsEntities: AlbumEntity[], artistId: string) =>
  albumsEntities.filter(entity => entity.artistId === artistId);

const getArtistAlbumsEntities = (artistId: string) => createSelector(
  getAlbumsEntities,
  (albumEntities: AlbumEntity[]) =>
    getAlbumsEntitiesByArtistId(albumEntities, artistId)
);

export const getImageIds = createSelector(
  getArtistsEntities,
  getAlbumsEntities,
  (artistsEntities, albumEntities) => {
    const ids: ImageId[] = [];
    for (const entity of artistsEntities) {
      if (entity.imageId) {
        ids.push(entity.imageId);
      }
    }

    for (const entity of albumEntities) {
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
    artists.map(a => createArtist(a.id, a.name, getImageUrl(images, a.imageId.id), a.mbid))
);

export const getArtist = (artistId: string) => createSelector(
  getArtistEntitiesMap,
  getImagesEntitiesMap,
  (artistsMap: Dictionary<ArtistEntity>, images: Dictionary<Image>) => {
    const artistEntity = artistsMap[artistId];
    if (!artistEntity) {
      return undefined;
    }

    return createArtist(artistEntity.id, artistEntity.name, getImageUrl(images, artistEntity.imageId.id), artistEntity.mbid);
  }
);

export const getArtistAlbums = (artistId: string) => createSelector(
  getArtistAlbumsEntities(artistId),
  getImagesEntitiesMap,
  (albums, images) => {
    const res: Album[] = [];
    if (albums) {
      for (const album of albums) {
        const image = images[album.imageId.id];
        res.push(createAlbum(album.id, album.title, album.year, image ? image.url : '', artistId));
      }
    }
    return res;
  }
);

export const getArtistsLoaded = createSelector(
  selectArtistState,
  state => state.loaded
);
