import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Album } from '../../models/album';
import { AlbumsStorageService } from './albums-storage.service';
import { MuslibApi } from '../../../server/api/server-api';
import { Store } from '@ngrx/store';
import * as fromMuslib from '../store/ngrx/muslib.reducer';

@Injectable()
export class AlbumsService {

  constructor(
    private readonly store: Store<fromMuslib.State>,
    private readonly storage: AlbumsStorageService,
    private readonly server: MuslibApi
  ) {
  }

  getAlbums(id: string): Observable<Album[]> {
    return NEVER;
    // return this.artistsQuery.getArtistAlbums(id)
    //   .pipe(
    //     switchMap(albumIds => this.query.getAlbums(albumIds))
    //   );
  }

  loadAlbums(artistId: string): void {
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
    this.storage.addAlbum(artistId, year, title, image)
      .catch(console.log);
  }

  deleteAlbum(artistId: string, id: string): void {
    this.storage.deleteAlbum(artistId, id)
      .catch(console.log);
  }

}
