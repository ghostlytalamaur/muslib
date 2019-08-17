import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Album } from '../../models/album';
import { MuslibApi } from '../../../server/api/server-api';
import { Store } from '@ngrx/store';
import * as fromMuslib from '../store/ngrx/muslib.reducer';
import * as AlbumsActions from '../store/ngrx/albums.actions';

@Injectable()
export class AlbumsService {

  constructor(
    private readonly store: Store<fromMuslib.State>,
    private readonly server: MuslibApi
  ) {
  }

  getAlbums(artistId: string): Observable<Album[]> {
    return this.store.select(fromMuslib.getArtistAlbums(artistId));
  }

  loadAlbums(artistId: string): void {
    this.store.dispatch(AlbumsActions.loadAlbums({ artistId }));
    // const artist = this.artistsQuery.getEntity(artistId);
    // if (!artist || !artist.mbid) {
    //   return;
    // }
    //
    // this.server.mb2.releaseGroups(artist.mbid)
    //   .pipe(
    //     map(groups => {
    //       return groups.releaseGroups
    //         .map(group => createAlbumEntity(group.id, group.title, group.year, group.id, artistId));
    //     })
    //   )
    //   .subscribe(albums => {
    //     this.store.add(albums);
    //     const albumsIds = albums.map(album => album.id);
    //     this.imgService.loadImages(ImageType.CoverArt, ...albumsIds);
    //     this.artistsStore.update(artistId, ignored => ({
    //       albums: albumsIds
    //     }));
    //   });
  }

  getFavoriteAlbums(artistId: string): Observable<Album[]> {
    return NEVER;
    // return this.query.getFavoriteAlbums(artistId);
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
