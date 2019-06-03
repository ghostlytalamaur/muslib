import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, publish, refCount } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Artist } from '../../models/artist';
import { StatusService } from '../../services/status.service';
import { BaseService } from './base-library.service';
import { Collections } from './constants';

interface FireArtist {
  name: string;
}

@Injectable()
export class ArtistsService extends BaseService<FireArtist, Artist> {

  private artists$: Observable<Artist[]>;

  constructor(
    statusService: StatusService,
    authService: AuthService,
    fireStore: AngularFirestore,
    storage: AngularFireStorage
  ) {
    console.log('ArtistService constructor', !!statusService, !!authService, !!fireStore, !!storage);
    super(statusService, authService, fireStore, storage);
  }

  getArtists(): Observable<Artist[]> {
    if (!this.artists$) {
      this.artists$ = this.getItems(Collections.ARTISTS, (id, data, image$) => new Artist(id, data.name, image$))
        .pipe(
          publish(),
          refCount()
        );
    }
    return this.artists$;
  }

  deleteArtist(docId: string): Promise<void> {
    return this.deleteItem(Collections.ARTISTS, docId);
  }

  addArtist(name: string, image?: File): Promise<string> {
    return this.addItem(Collections.ARTISTS, {name}, image);
  }

  getArtist(id: string): Observable<Artist> {
    return this.getArtists()
      .pipe(
        map(artists => {
          const artist = artists.find((a) => a.id === id);
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
