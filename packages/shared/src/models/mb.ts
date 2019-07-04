import { contramap, Ord, ordNumber } from 'fp-ts/lib/Ord';

export interface Artist {
  id: string;
  name: string;
}

export interface ArtistSearchResult {
  artists: Artist[];
}

export type ReleaseType = 'Album' | 'Single';

export interface ReleaseGroup {
  id: string;
  title: string;
  year: number;
  type: ReleaseType;
}

export const compareByYear: Ord<ReleaseGroup> = contramap((group: ReleaseGroup) => group.year)(ordNumber);

export interface ReleaseGroupsResult {
  releaseGroups: ReleaseGroup[];
}
