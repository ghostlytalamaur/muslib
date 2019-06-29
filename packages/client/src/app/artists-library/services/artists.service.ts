import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, publish, refCount } from 'rxjs/operators';
import { MuslibApi } from 'src/server/api/server-api';
import { AuthService } from '../../auth/auth.service';
import { Artist } from '../../models/artist';
import { IdHolder } from '../../models/id-holder';
import { StatusService } from '../../services/status.service';
import { BaseService } from './base-library.service';
import { Collections } from './constants';

interface FireArtist {
  name: string;
  mbid?: string;
}

@Injectable()
export class ArtistsService extends BaseService<FireArtist, Artist> {
  private artists$: Observable<Artist[]>;

  constructor(
    statusService: StatusService,
    server: MuslibApi,
    authService: AuthService,
    fireStore: AngularFirestore,
    storage: AngularFireStorage
  ) {
    super(statusService, server, authService, fireStore, storage);
  }

  getArtists(): Observable<Artist[]> {
    if (!this.artists$) {
      this.artists$ = this.getItems(
        Collections.ARTISTS,
        300,
        (id, data, image$) => new Artist(id, data.name, image$, data.mbid)
      ).pipe(
        publish(),
        refCount()
      );
    }
    return this.artists$;
  }

  deleteArtist(docId: string): Promise<void> {
    return this.deleteItem(Collections.ARTISTS, docId);
  }

  addArtist(name: string, image?: File | string): Promise<string> {
    return this.addItem(Collections.ARTISTS, { name }, image);
  }

  updateArtist(artist: Partial<Artist> & IdHolder): Promise<void> {
    return this.updateItem(Collections.ARTISTS, artist);
  }

  getArtist(id: string): Observable<Artist> {
    return this.getArtists().pipe(
      map(artists => {
        const artist = artists.find(a => a.id === id);
        if (artist) {
          return artist;
        } else {
          throw new Error('Artist not found.');
        }
      })
    );
  }

  // tslint:disable-next-line: typedef
  [Symbol.toStringTag]() {
    return 'Artist Service';
  }
}