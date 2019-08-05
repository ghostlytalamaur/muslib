import { ArtistEntity } from '../artist.entity';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as ArtistsActions from './artists.actions';

export const artistFeatureKey = 'artists';

export interface State extends EntityState<ArtistEntity> {
}

export const adapter = createEntityAdapter<ArtistEntity>();
const initialState: State = adapter.getInitialState();

export const reducer = createReducer(initialState,
  on(ArtistsActions.setArtists, (state, { artists }) => adapter.addAll(artists, state))
);

