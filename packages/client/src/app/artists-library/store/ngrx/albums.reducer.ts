import { Album } from '../../../models/album';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as AlbumsActions from './albums.actions';
import * as ArtistActions from './artists.actions';
import { ImageId } from '../../../models/image';

export const albumsFeatureKey = 'albums';

export interface State extends EntityState<Album> {
}

export const adapter = createEntityAdapter<Album>();
const initialState: State = adapter.getInitialState();

export const reducer = createReducer(initialState,
  on(AlbumsActions.addAlbums, (state, { albums }) => adapter.addMany(albums, state)),
  on(ArtistActions.deleteArtists, (state, { ids }) => {
    const artistIds = new Set<string>(ids);
    return adapter.removeMany((album: Album): boolean => artistIds.has(album.artistId), state);
  }),
  on(ArtistActions.artistsModified, (state, { artists }) => {
    const artistIds = new Set<string>(artists.map(artist => artist.id));
    return adapter.removeMany((album: Album): boolean => artistIds.has(album.artistId), state);
  })
);

export function getImageIdsByArtistIds(state: State, artistIds: string[]): ImageId[] {
  const artistIdsSet: Set<string> = new Set(artistIds);
  const res: ImageId[] = [];
  for (const albumId of state.ids) {
    const album = state.entities[albumId];
    if (album && album.image && artistIdsSet.has(album.artistId)) {
      res.push(album.image);
    }
  }
  return res;
}

export const getAlbumsEntitiesByArtistId = (albumsEntities: Album[], artistId: string) =>
  albumsEntities.filter(entity => entity.artistId === artistId);


export const {
  selectEntities: getAlbumsEntitiesMap,
  selectAll: getAlbumsEntities,
  selectIds: getAlbumsIds,
  selectTotal: getTotalAlbums
} = adapter.getSelectors();
