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
  date: string;
  type: ReleaseType;
}

export interface ReleaseGroupsResult {
  releaseGroups: ReleaseGroup[];
}
