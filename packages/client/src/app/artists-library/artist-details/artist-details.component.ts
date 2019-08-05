import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NEVER, Observable } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
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
import { ArtistSearchResult } from 'muslib/shared';
import { BaseComponent } from '../../shared/BaseComponent';
import { ArtistsService } from '../services/artists.service';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss']
})
export class ArtistDetailsComponent extends BaseComponent implements OnInit {
  artist$: Observable<Artist | undefined> | undefined;
  albums$: Observable<Album[]> | undefined;
  favoriteAlbums$: Observable<Album[]> | undefined;
  private artistId: string | null;

  constructor(
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private server: MuslibApi
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        takeUntil(this.alive$)
      )
      .subscribe(id => this.setArtist(id));
  }

  private setArtist(id: string | null): void {
    this.artistId = id;
    if (this.artistId) {
      this.artist$ = this.artistsService.getArtist(this.artistId);
      this.albumsService.loadAlbums(this.artistId);
      this.albums$ = this.albumsService.getAlbums(this.artistId);
      this.favoriteAlbums$ = this.albumsService.getFavoriteAlbums(this.artistId);
    } else {
      this.artist$ = undefined;
      this.albums$ = undefined;
      this.favoriteAlbums$ = undefined;
    }
  }

  addNewAlbum(): void {
    const dialogRef = this.matDialog.open(NewAlbumDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.alive$))
      .subscribe(
        (data: NewAlbumData) => {
          if (data && this.artistId) {
            this.albumsService.addAlbum(this.artistId, data.name, data.year, data.image);
          }
        }
      );
  }

  onDeleteAlbum(albumId: string): void {
    if (this.artistId) {
      this.albumsService.deleteAlbum(this.artistId, albumId);
    }
  }

  selectMbid(): void {
    if (!this.artist$) {
      return;
    }

    const selectId = (artist: Artist, similar: ArtistSearchResult): Observable<string> => {
      let selected = -1;
      if (artist.mbid) {
        selected = similar.artists.findIndex(a => artist.mbid === a.id);
      }
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
        filter(artist => !!artist),
        switchMap((artist: Artist) =>
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
