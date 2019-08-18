import { Album } from '../../../models/album';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as AlbumsActions from './albums.actions';

export const albumsFeatureKey = 'albums';

export interface State extends EntityState<Album> {
}

export const adapter = createEntityAdapter<Album>();
const initialState: State = adapter.getInitialState();

export const reducer = createReducer(initialState,
  on(AlbumsActions.addAlbums, (state, { albums }) => adapter.addMany(albums, state))
);
