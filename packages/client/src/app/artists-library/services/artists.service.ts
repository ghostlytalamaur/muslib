import { Observable, Subject } from 'rxjs';
import { ArtistsStorageService } from './artists-storage.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromArtists from '../store/ngrx/artists.reducer';
import * as fromMuslib from '../store/ngrx/muslib.reducer';
import * as ArtistsActions from '../store/ngrx/artists.actions';
import { Artist } from '../../models/artist';
import { IdHolder } from '../../models/id-holder';

@Injectable()
export class ArtistsService implements OnDestroy {
  private readonly alive$: Subject<void>;

  constructor(
    private readonly storageService: ArtistsStorageService,
    private store: Store<fromArtists.State>
  ) {
    this.alive$ = new Subject<void>();
  }

  getArtists(): Observable<Artist[]> {
    return this.store.select(fromMuslib.getArtists);
  }

  getArtist(id: string): Observable<Artist | undefined> {
    return this.store.select(fromMuslib.getArtist(id));
  }

  addArtist(name: string, image?: File | string): void {
    this.storageService.addArtist(name, image)
      .catch();
  }

  deleteArtist(id: string): void {
    this.storageService.deleteArtist(id)
      .catch();
  }

  updateArtist(artist: IdHolder & Partial<Artist>): void {
    this.storageService.updateArtist(artist)
      .catch();
  }

  loadArtists(): void {
    this.store.dispatch(ArtistsActions.loadArtists());
  }

  getIsLoaded(): Observable<boolean> {
    return this.store.select(fromMuslib.getArtistsLoaded);
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }
}
