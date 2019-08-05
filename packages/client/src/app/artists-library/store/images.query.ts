// import { QueryEntity } from '@datorama/akita';
// import { ImagesState, ImagesStore } from './images.store';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Image } from '../../models/image';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ImagesQuery extends QueryEntity<ImagesState> {
//
//   constructor(store: ImagesStore) {
//     super(store);
//   }
//
//   getImages(ids: string[]): Observable<(Image | undefined)[]> {
//     return this.selectMany(ids);
//   }
//
//   getImage(id: string): Observable<Image | undefined> {
//     return this.selectEntity(id);
//   }
// }
