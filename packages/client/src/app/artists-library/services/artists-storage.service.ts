import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MuslibApi } from 'src/server/api/server-api';
import { AuthService } from '../../auth/auth.service';
import { IdHolder } from '../../models/id-holder';
import { StatusService } from '../../services/status.service';
import { BaseService } from './base-library.service';
import { Collections } from './constants';
import { ArtistEntity, createArtistEntity } from '../store/artist.entity';

interface FireArtist {
  name: string;
  mbid?: string;
}

@Injectable()
export class ArtistsStorageService extends BaseService<FireArtist, ArtistEntity> {

  constructor(
    statusService: StatusService,
    server: MuslibApi,
    authService: AuthService,
    fireStore: AngularFirestore,
    storage: AngularFireStorage
  ) {
    super(statusService, server, authService, fireStore, storage);
  }

  getArtists(): Observable<ArtistEntity[]> {
    return this.getItems(
        Collections.ARTISTS,
        300,
        (id, data, imageId) => createArtistEntity(id, data.name, imageId, data.mbid)
      );
  }

  deleteArtist(docId: string): Promise<void> {
    return this.deleteItem(Collections.ARTISTS, docId);
  }

  addArtist(name: string, image?: File | string): Promise<string> {
    return this.addItem(Collections.ARTISTS, { name }, image);
  }

  updateArtist(artist: Partial<ArtistEntity> & IdHolder): Promise<void> {
    return this.updateItem(Collections.ARTISTS, artist);
  }

}
