import { Artist, PartialArtist } from '../../models/artist';
import { NEVER, Observable, Subject } from 'rxjs';
import { ArtistsStorageService } from './artists-storage.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromArtists from '../store/ngrx/artists.reducer';
import * as fromMuslib from '../store/ngrx/muslib.reducer';

@Injectable()
export class ArtistsService implements OnDestroy {
  private readonly alive$: Subject<void>;

  constructor(
    private readonly storageService: ArtistsStorageService,
    // private store: Store<fromArtists.State>
  ) {
    this.alive$ = new Subject<void>();
  }

  addArtist(name: string, image?: File | string): void {
    this.storageService.addArtist(name, image)
      .catch();
  }

  deleteArtist(id: string): void {
    this.storageService.deleteArtist(id)
      .catch();
  }

  updateArtist(artist: PartialArtist): void {
    this.storageService.updateArtist(artist)
      .catch();
  }

  getArtists(): Observable<Artist[]> {
    // return this.store.select(fromMuslib.getArtists);
    return NEVER;
  }

  getArtist(id: string): Observable<Artist | undefined> {
    return NEVER;
    // return this.store.select(fromMuslib.getArtist(id));
  }

  loadArtists(): void {
    // this.query.selectLoading()
    //   .pipe(
    //     exhaustMap(loading => loading ? this.storageService.getArtists() : NEVER),
    //     takeUntil(this.alive$)
    //   )
    //   .subscribe(
    //     artists => {
    //       this.imgService.loadImages(ImageType.FireStorage, ...artists.map(a => a.imageId));
    //       this.store.set(artists);
    //     }
    //   );
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }
}
