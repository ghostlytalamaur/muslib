import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, NEVER, Observable, Subject} from 'rxjs';
import {Album} from '../../models/album';
import {ActivatedRoute} from '@angular/router';
import {Artist} from '../../models/artist';
import {catchError, map, publishReplay, refCount, switchMap, takeUntil} from 'rxjs/operators';
import {AlbumsService} from '../services/albums.service';
import {MatDialog} from '@angular/material';
import {NewAlbumData, NewAlbumDialogComponent} from '../new-album-dialog/new-album-dialog.component';
import {ArtistsService} from '../services/artists.service';

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
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.artistId$ = new BehaviorSubject<string>(undefined);

    this.route.paramMap.pipe(
      map(params => params.get('id')),
      takeUntil(this.alive$),
    ).subscribe((id) => {
      this.artistId$.next(id);
    });

    this.artist$ = this.artistId$.pipe(
      switchMap((id) => {
        return this.artistsService.getArtist(id);
      }),
      publishReplay(1),
      refCount()
    );

    this.albums$ = this.artist$.pipe(
      switchMap(artist => this.albumsService.getAlbums(artist.id)),
      catchError((err) => {
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
    dialogRef.afterClosed().toPromise()
      .then((data: NewAlbumData) => {
        if (data) {
          console.log('Add album', data);
          this.albumsService.addAlbum(this.artistId$.value, data.year, data.name, data.image)
            .catch((err) => console.log('Error while adding new album.', err));
        }
      });
  }

  onDeleteAlbum(albumId: string): void {
    this.albumsService.deleteAlbum(this.artistId$.value, albumId)
      .catch(() => this.error = `Cannot delete album.`);
  }
}
