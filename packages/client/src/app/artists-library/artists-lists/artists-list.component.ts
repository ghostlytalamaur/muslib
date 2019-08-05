import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist } from '../../models/artist';
import { ArtistsService } from '../services/artists.service';
import { MatDialog } from '@angular/material';
import { NewArtistData, NewArtistDialogComponent } from '../new-artist-dialog/new-artist-dialog.component';

@Component({
  selector: 'app-artists-lists',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {
  artists$: Observable<Artist[]>;

  constructor(
    private service: ArtistsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.artists$ = this.service.getArtists();
  }

  deleteArtist(id: string): void {
    this.service.deleteArtist(id);
  }

  trackById(index: number, artist: Artist): string {
    return artist.id;
  }

  onNewArtist(): void {
    const dlg = this.dialog.open(NewArtistDialogComponent);
    dlg.afterClosed().subscribe((data: NewArtistData) => {
      if (data) {
        this.service.addArtist(data.name, data.image);
      }
    });
  }
}
