import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromMuslib from '../store/ngrx/muslib.reducer';
import * as AlbumsActions from '../store/ngrx/albums.actions';
import { Album } from '../../models/album';

@Injectable()
export class AlbumsService {

  constructor(
    private readonly store: Store<fromMuslib.State>,
  ) {
  }

  getAlbums(artistId: string): Observable<Album[]> {
    return this.store.select(fromMuslib.getArtistAlbums(artistId));
  }

  loadAlbums(artistId: string): void {
    this.store.dispatch(AlbumsActions.loadAlbums({ artistId }));
  }

  getFavoriteAlbums(artistId: string): Observable<Album[]> {
    return NEVER;
  }

  addAlbum(artistId: string, title: string, year: number, image: File): void {
    // this.storage.addAlbum(artistId, year, title, image)
    //   .catch(console.log);
  }

  deleteAlbum(artistId: string, id: string): void {
    // this.storage.deleteAlbum(artistId, id)
    //   .catch(console.log);
  }

}
