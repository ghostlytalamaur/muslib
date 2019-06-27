import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, NEVER, Observable, Subject } from 'rxjs';
import { catchError, map, publishReplay, refCount, switchMap, take, takeUntil } from 'rxjs/operators';
import {
  ListDialogComponent,
  ListDialogData,
  ListDialogResult
} from 'src/app/shared/list-dialog/list-dialog.component';
import { MuslibApi } from '../../../server/api/server-api';
import { Album } from '../../models/album';
import { Artist } from '../../models/artist';
import { NewAlbumData, NewAlbumDialogComponent } from '../new-album-dialog/new-album-dialog.component';
import { AlbumsService } from '../services/albums.service';
import { ArtistsService } from '../services/artists.service';
import { ArtistSearchResult } from '../../../server/api/mb-api';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss']
})
export class ArtistDetailsComponent implements OnInit, OnDestroy {
  artist$: Observable<Artist>;
  albums$: Observable<Album[]>;
  private alive$: Subject<boolean> = new Subject<boolean>();
  private artistId$: BehaviorSubject<string>;
  private error: string;

  constructor(
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private server: MuslibApi
  ) {
  }

  ngOnInit(): void {
    this.artistId$ = new BehaviorSubject<string>(undefined);

    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        takeUntil(this.alive$)
      )
      .subscribe(id => {
        this.artistId$.next(id);
      });

    this.artist$ = this.artistId$.pipe(
      switchMap(id => {
        return this.artistsService.getArtist(id);
      }),
      publishReplay(1),
      refCount()
    );

    this.albums$ = this.artist$.pipe(
      switchMap(artist => this.albumsService.getAlbums(artist.id)),
      catchError(err => {
        console.log('GetAlbums error', err);
        return NEVER;
      })
    );
  }

  ngOnDestroy(): void {
    this.alive$.next(false);
    this.alive$.complete();
  }

  addNewAlbum(): void {
    const dialogRef = this.matDialog.open(NewAlbumDialogComponent);
    dialogRef
      .afterClosed()
      .toPromise()
      .then((data: NewAlbumData) => {
        if (data) {
          console.log('Add album', data);
          this.albumsService
            .addAlbum(this.artistId$.value, data.year, data.name, data.image)
            .catch(err => console.log('Error while adding new album.', err));
        }
      });
  }

  onDeleteAlbum(albumId: string): void {
    this.albumsService
      .deleteAlbum(this.artistId$.value, albumId)
      .catch(() => (this.error = `Cannot delete album.`));
  }

  selectMbid(): void {
    const selectId = (artist: Artist, similar: ArtistSearchResult): Observable<string> => {
      const selected = artist.mbid && similar.artists.findIndex(a => artist.mbid === a.id);
      const data: ListDialogData = {
        title: 'Select Artist',
        names: similar.artists.map(a => a.name),
        selected
      };

      const config: MatDialogConfig<ListDialogData> = {
        minWidth: '500px',
        data
      };
      return this.matDialog.open<ListDialogComponent, ListDialogData, ListDialogResult>(ListDialogComponent, config)
        .afterClosed()
        .pipe(
          map(result => {
            if (result) {
              return similar.artists[result.selected].id;
            } else {
              throw new Error('Dialog closed by cancel');
            }
          })
        );
    };

    this.artist$
      .pipe(
        take(1),
        switchMap((artist) =>
          this.server.mb2.searchArtist(artist.name)
            .pipe(
              map(similar => ({ artist, similar }))
            )
        ),
        takeUntil(this.alive$),
        switchMap(({ artist, similar }) =>
          selectId(artist, similar).pipe(map(mbid => ({ artist, mbid })))
        )
      )
      .subscribe(
        ({ artist, mbid }) => this.artistsService.updateArtist({ id: artist.id, mbid }),
        () => {
        }
      );
  }
}
