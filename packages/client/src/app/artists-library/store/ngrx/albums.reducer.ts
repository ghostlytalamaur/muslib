import { AlbumEntity } from '../album.entity';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as AlbumsActions from './albums.actions';

export const albumsFeatureKey = 'albums';

export interface State extends EntityState<AlbumEntity> {
}

export const adapter = createEntityAdapter<AlbumEntity>();
const initialState: State = adapter.getInitialState();

export const reducer = createReducer(initialState,
  on(AlbumsActions.addAlbums, (state, { albums }) => adapter.addMany(albums, state))
);
