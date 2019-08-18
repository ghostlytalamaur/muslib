import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistsService } from '../services/artists.service';
import { MatDialog } from '@angular/material';
import { NewArtistData, NewArtistDialogComponent } from '../new-artist-dialog/new-artist-dialog.component';
import { Artist } from '../../models/artist';
import { ImagesService } from '../services/images.service';
import { ImagesMap } from '../../models/image';

@Component({
  selector: 'app-artists-lists',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistsListComponent implements OnInit {
  artists$: Observable<Artist[]>;
  images$: Observable<ImagesMap>;
  loaded$: Observable<boolean>;

  constructor(
    private service: ArtistsService,
    private imgService: ImagesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.artists$ = this.service.getArtists();
    this.images$ = this.imgService.getImages();
    this.loaded$ = this.service.getIsLoaded();
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
