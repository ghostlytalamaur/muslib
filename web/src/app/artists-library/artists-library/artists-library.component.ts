import { Component, OnInit } from '@angular/core';
import { AlbumsService } from '../services/albums.service';
import { ArtistsService } from '../services/artists.service';

@Component({
  selector: 'app-artists-library',
  templateUrl: './artists-library.component.html',
  styleUrls: ['./artists-library.component.scss'],
  providers: [
    ArtistsService,
    AlbumsService
  ]
})
export class ArtistsLibraryComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
