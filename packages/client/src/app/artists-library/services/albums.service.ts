import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { Album, createAlbum } from '../../models/album';
import { AlbumsStore } from '../store/albums.store';
import { AlbumsQuery } from '../store/albums.query';
import { AlbumsStorageService } from './albums-storage.service';
import { MuslibApi } from '../../../server/api/server-api';
import { map, switchMap } from 'rxjs/operators';
import { ArtistsStore } from '../store/artists.store';
import { ImagesService } from './images.service';
import { ImageType } from '../../models/image';
import { ArtistsQuery } from '../store/artists.query';
import { createAlbumEntity } from '../store/album.entity';

@Injectable()
export class AlbumsService {

  constructor(
    private readonly store: AlbumsStore,
    private readonly query: AlbumsQuery,
    private readonly storage: AlbumsStorageService,
    private readonly server: MuslibApi,
    private readonly artistsQuery: ArtistsQuery,
    private readonly artistsStore: ArtistsStore,
    private readonly imgService: ImagesService
  ) {
  }

  getAlbums(id: string): Observable<Album[]> {
    return this.artistsQuery.getArtistAlbums(id)
      .pipe(
        switchMap(albumIds => this.query.getAlbums(albumIds))
      );
  }

  loadAlbums(artistId: string): void {
    const artist = this.artistsQuery.getEntity(artistId);
    if (!artist || !artist.mbid) {
      return;
    }

    this.server.mb2.releaseGroups(artist.mbid)
      .pipe(
        map(groups => {
          return groups.releaseGroups
            .map(group => createAlbumEntity(group.id, group.title, group.year, group.id, artistId));
        })
      )
      .subscribe(albums => {
        this.store.add(albums);
        const albumsIds = albums.map(album => album.id);
        this.imgService.loadImages(ImageType.CoverArt, ...albumsIds);
        this.artistsStore.update(artistId, ignored => ({
          albums: albumsIds
        }));
      });
  }

  getFavoriteAlbums(artistId: string): Observable<Album[]> {
    return this.query.getFavoriteAlbums(artistId);
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
