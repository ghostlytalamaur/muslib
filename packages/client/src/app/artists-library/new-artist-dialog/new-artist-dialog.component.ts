import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MuslibApi } from '../../../server/api/server-api';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, delay, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Artist } from '@muslib/shared';

export interface NewArtistData {
  name: string;
  image: File | undefined;
}

function collectUniqueNames(artists: Artist[]): string[] {
  const names = artists.reduce((presentNames, a) => presentNames.add(a.name), new Set<string>());
  return new Array<string>(...names);
}

@Component({
  selector: 'app-new-artist-dialog',
  templateUrl: './new-artist-dialog.component.html',
  styleUrls: ['./new-artist-dialog.component.scss']
})
export class NewArtistDialogComponent implements OnInit {
  artistData: NewArtistData = { name: '', image: undefined };
  private readonly artistName$: Subject<string>;
  readonly similarArtists$: Observable<string[]>;

  constructor(
    private dialogRef: MatDialogRef<NewArtistDialogComponent, NewArtistData>,
    private server: MuslibApi
  ) {
    this.artistName$ = new Subject();
    this.similarArtists$ = this.artistName$
      .pipe(
        distinctUntilChanged((prev, cur) => prev.toLowerCase() === cur.toLowerCase()),
        delay(100),
        switchMap(name => this.server.mb2.searchArtist(name)
          .pipe(
            catchError(() => EMPTY)
          )
        ),
        map(result => collectUniqueNames(result.artists))
      );
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.dialogRef.close(this.artistData);
  }

  onImageSelected(image: File): void {
    this.artistData.image = image;
  }

  nameChanged(name: string): void {
    this.artistName$.next(name);
  }
}
