import { Album } from '../../../models/album';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, createSelector, on, Selector } from '@ngrx/store';
import * as AlbumsActions from './albums.actions';
import * as ArtistActions from './artists.actions';
import { ImageId } from '../../../models/image';

export const albumsFeatureKey = 'albums';

export interface State extends EntityState<Album> {
}

interface ParentState {
  [albumsFeatureKey]: State;
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

const selectAlbumsState: Selector<ParentState, State> = state => state[albumsFeatureKey];
export const {
  selectEntities: getAlbumsEntitiesMap,
  selectAll: getAlbums,
  selectIds: getAlbumsIds,
  selectTotal: getTotalAlbums
} = adapter.getSelectors<ParentState>(selectAlbumsState);

export const getArtistAlbums: (artistId: string) => Selector<ParentState, Album[]> =
  artistId => createSelector(
    getAlbums,
    albums => albums.filter(album => album.artistId === artistId)
  );

export function getImageIdsByArtistIds(parentState: ParentState, artistIds: string[]): ImageId[] {
  return collectImageIdsByArtistIds(getAlbums(parentState), artistIds);
}

function collectImageIdsByArtistIds(albums: Album[], artistIds: string[]): ImageId[] {
  const artistIdsSet: Set<string> = new Set(artistIds);
  const res: ImageId[] = [];
  for (const album of albums) {
    if (album && album.image && artistIdsSet.has(album.artistId)) {
      res.push(album.image);
    }
  }
  return res;
}
