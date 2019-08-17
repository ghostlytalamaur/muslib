import { Component, OnInit } from '@angular/core';
import { ArtistsService } from '../services/artists.service';
import { AlbumsService } from '../services/albums.service';

@Component({
  selector: 'app-artists-library',
  templateUrl: './artists-library.component.html',
  styleUrls: ['./artists-library.component.scss'],
  providers: [ArtistsService, AlbumsService]
})
export class ArtistsLibraryComponent implements OnInit {
  constructor(
    private readonly service: ArtistsService
  ) {}

  ngOnInit(): void {
    this.service.loadArtists();
  }

}
