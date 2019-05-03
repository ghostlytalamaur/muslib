import {Artist} from '../../models/artist';

export class TopArtists {
  constructor(
    readonly page: number,
    readonly total: number,
    readonly artists: Artist[]
  ) {
  }
}
