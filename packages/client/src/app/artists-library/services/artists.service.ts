import { ArtistsStore } from '../store/artists.store';
import { Artist, PartialArtist } from '../../models/artist';
import { NEVER, Observable, Subject } from 'rxjs';
import { ArtistsQuery } from '../store/artists.query';
import { ArtistsStorageService } from './artists-storage.service';
import { Injectable, OnDestroy } from '@angular/core';
import { exhaustMap, takeUntil } from 'rxjs/operators';
import { ImagesService } from './images.service';
import { ImageType } from '../../models/image';

@Injectable()
export class ArtistsService implements OnDestroy {
  private readonly alive$: Subject<void>;

  constructor(
    private readonly store: ArtistsStore,
    private readonly query: ArtistsQuery,
    private readonly storageService: ArtistsStorageService,
    private readonly imgService: ImagesService,
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
    return this.query.getArtists();
  }

  getArtist(id: string): Observable<Artist | undefined> {
    return this.query.getArtist(id);
  }

  loadArtists(): void {
    this.query.selectLoading()
      .pipe(
        exhaustMap(loading => loading ? this.storageService.getArtists() : NEVER),
        takeUntil(this.alive$)
      )
      .subscribe(
        artists => {
          this.imgService.loadImages(ImageType.FireStorage, ...artists.map(a => a.imageId));
          this.store.set(artists);
        }
      );
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }
}
