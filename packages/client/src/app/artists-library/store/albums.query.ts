// import { combineQueries, QueryEntity } from '@datorama/akita';
// import { Observable, of } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { AlbumsState, AlbumsStore } from './albums.store';
// import { Album, createAlbum } from '../../models/album';
// import { map, switchMap } from 'rxjs/operators';
// import { ImagesQuery } from './images.query';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AlbumsQuery extends QueryEntity<AlbumsState> {
//   constructor(store: AlbumsStore,
//               private readonly imgQuery: ImagesQuery) {
//     super(store);
//   }
//
//   getAlbums(ids: string[]): Observable<Album[]> {
//     return combineQueries([
//       this.selectMany(ids),
//       this.selectMany(ids, entity => entity.imageId)
//         .pipe(switchMap(imageIds => this.imgQuery.getImages(imageIds)))
//     ])
//       .pipe(
//         map(([entities, images]) => {
//             return entities.map((entity, index) => {
//               const image = images[index];
//               const imageUrl = image ? image.url : '';
//               return createAlbum(entity.id, entity.title, entity.year, imageUrl, entity.artistId);
//             });
//           }
//         )
//       );
//   }
//
//   getFavoriteAlbums(artistId: string): Observable<Album[]> {
//     return of([]);
//   }
// }
