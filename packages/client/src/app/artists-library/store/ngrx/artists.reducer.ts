import { Artist } from '../../../models/artist';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as ArtistsActions from './artists.actions';

export const artistFeatureKey = 'artists';

export interface State extends EntityState<Artist> {
  loaded: boolean;
}

export const adapter = createEntityAdapter<Artist>();
const initialState: State = adapter.getInitialState({
  loaded: false
});

export const reducer = createReducer(initialState,
  on(ArtistsActions.setArtists, (state, { artists }) => adapter.addAll(artists, {
    ...state,
    loaded: true
  })),
  on(ArtistsActions.artistsAdded, (state, { artists }) => adapter.addMany(artists, {
    ...state,
    loaded: true
  })),
  on(ArtistsActions.artistsModified, (state, { artists }) => adapter.upsertMany(artists, {
    ...state,
    loaded: true
  })),
  on(ArtistsActions.artistsDeleted, (state, { ids }) => adapter.removeMany(ids, {
    ...state,
    loaded: true
  }))
);

