import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Album} from '../../models/album';
import {AuthService} from '../../auth/auth.service';
import {BaseService} from './base-library.service';
import {Collections} from './constants';
import {StatusService} from '../../services/status.service';
import { HttpClient } from '@angular/common/http';

interface FireAlbum {
  year: number;
  name: string;
}

@Injectable()
export class AlbumsService extends BaseService<FireAlbum, Album> {

  constructor(
    statusService: StatusService,
    http: HttpClient,
    authService: AuthService,
    fireStore: AngularFirestore,
    fireStorage: AngularFireStorage
  ) {
    super(statusService, http, authService, fireStore, fireStorage);
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
    return this.getItems(AlbumsService.getAlbumsCollection(artistId),
      (id, data, image$) => new Album(id, data.year, data.name, image$, artistId));
  }

}
