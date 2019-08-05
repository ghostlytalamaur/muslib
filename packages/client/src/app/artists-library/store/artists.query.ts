import { combineQueries, QueryEntity } from '@datorama/akita';
import { ArtistsState, ArtistsStore } from './artists.store';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { ArtistEntity } from './artist.entity';
import { map, switchMap } from 'rxjs/operators';
import { Image } from '../../models/image';
import { Artist, createArtist } from '../../models/artist';
import { ImagesQuery } from './images.query';

@Injectable({
  providedIn: 'root'
})
export class ArtistsQuery extends QueryEntity<ArtistsState> {
  constructor(store: ArtistsStore,
              private readonly imgQuery: ImagesQuery) {
    super(store);
  }

  getArtists(): Observable<Artist[]> {
    return combineQueries([
      this.selectAll(),
      this.selectAll()
        .pipe(
          switchMap(entities => this.imgQuery.getImages(entities.map(entity => entity.imageId)))
        )
    ])
      .pipe(
        map(([entities, images]: [ArtistEntity[], (Image | undefined)[]]): Artist[] => {
          return entities.map((entity, index) => {
            const image = images[index];
            const imageUrl = image ? image.url : '';
            return createArtist(entity.id, entity.name, imageUrl, entity.mbid);
          });
        })
      );
  }

  getArtist(id: string): Observable<Artist | undefined> {
    return combineQueries([
      this.selectEntity(id),
      this.selectEntity(id, entity => entity.imageId)
        .pipe(
          switchMap(imageId => imageId ? this.imgQuery.getImage(imageId) : of(undefined))
        )
    ])
      .pipe(
        map(([entity, image]) => createArtist(entity.id, entity.name, image ? image.url : '', entity.mbid))
      );
  }

  getArtistAlbums(id: string): Observable<string[]> {
    return this.selectEntity(id, entity => entity.albums);
  }

}
