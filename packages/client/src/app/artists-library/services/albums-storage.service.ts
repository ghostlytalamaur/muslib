import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MuslibApi } from 'src/server/api/server-api';
import { AuthService } from '../../auth/auth.service';
import { StatusService } from '../../services/status.service';
import { BaseService } from './base-library.service';
import { Collections } from './constants';
import { AlbumEntity, createAlbumEntity } from '../store/album.entity';

interface FireAlbum {
  year: number;
  name: string;
}

@Injectable()
export class AlbumsStorageService extends BaseService<FireAlbum, AlbumEntity> {
  constructor(
    statusService: StatusService,
    server: MuslibApi,
    authService: AuthService,
    fireStore: AngularFirestore,
    fireStorage: AngularFireStorage
  ) {
    super(statusService, server, authService, fireStore, fireStorage);
  }

  static getAlbumsCollection(artistId: string): string {
    return `${Collections.ARTISTS}/${artistId}/${Collections.ALBUMS}`;
  }

  addAlbum(
    artistId: string,
    year: number,
    name: string,
    image: File
  ): Promise<string> {
    return this.addItem(
      AlbumsStorageService.getAlbumsCollection(artistId),
      { name, year },
      image
    );
  }

  deleteAlbum(artistId: string, id: string): Promise<void> {
    return this.deleteItem(AlbumsStorageService.getAlbumsCollection(artistId), id);
  }

  getAlbums(artistId: string): Observable<AlbumEntity[]> {
    return this.getItems(
      AlbumsStorageService.getAlbumsCollection(artistId),
      96,
      (id, data, image) =>
        createAlbumEntity(id, data.name, data.year, image, artistId)
    );
  }
}
