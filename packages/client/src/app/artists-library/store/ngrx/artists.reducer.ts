import { Artist } from '../../../models/artist';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, createSelector, on, Selector } from '@ngrx/store';
import * as ArtistsActions from './artists.actions';
import { ImageId } from '../../../models/image';

export const artistFeatureKey = 'artists';

export interface State extends EntityState<Artist> {
  loaded: boolean;
}

interface ParentState {
  [artistFeatureKey]: State;
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

function selectArtistsState(state: ParentState): State {
  return state[artistFeatureKey];
}

export function getImageIds(parentState: ParentState, artists: string[]): ImageId[] {
  const state = selectArtistsState(parentState);
  const res: ImageId[] = [];
  for (const id of artists) {
    const entity = state.entities[id];
    if (entity && entity.image) {
      res.push(entity.image);
    }
  }
  return res;
}

export const {
  selectAll: getArtists,
  selectIds: getArtistsIds,
  selectTotal: getTotalArtists,
  selectEntities: getArtistEntitiesMap
} = adapter.getSelectors(selectArtistsState);

export const getArtist: (artistId: string) => Selector<ParentState, Artist | undefined> =
  (artistId: string) => createSelector(
    getArtistEntitiesMap,
    map => map[artistId]
  );

export function getArtistsLoaded(parentState: ParentState): boolean {
  return selectArtistsState(parentState).loaded;
}
