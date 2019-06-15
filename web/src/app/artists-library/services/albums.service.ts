import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MuslibApi } from 'src/server/api/server-api';
import { AuthService } from '../../auth/auth.service';
import { Album } from '../../models/album';
import { StatusService } from '../../services/status.service';
import { BaseService } from './base-library.service';
import { Collections } from './constants';

interface FireAlbum {
  year: number;
  name: string;
}

@Injectable()
export class AlbumsService extends BaseService<FireAlbum, Album> {

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

  addAlbum(artistId: string, year: number, name: string, image: File): Promise<string> {
    return this.addItem(AlbumsService.getAlbumsCollection(artistId), {name, year}, image);
  }

  deleteAlbum(artistId: string, id: string): Promise<void> {
    return this.deleteItem(AlbumsService.getAlbumsCollection(artistId), id);
  }

  getAlbums(artistId: string): Observable<Album[]> {
    return this.getItems(AlbumsService.getAlbumsCollection(artistId), 96,
      (id, data, image$) => new Album(id, data.year, data.name, image$, artistId));
  }

}
