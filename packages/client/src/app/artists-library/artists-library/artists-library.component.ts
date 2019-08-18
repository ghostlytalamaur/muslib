import { Component, OnInit } from '@angular/core';
import { ArtistsService } from '../services/artists.service';
import { AlbumsService } from '../services/albums.service';
import { ImagesService } from '../services/images.service';
import { routerAnimation } from '../../animations';

@Component({
  selector: 'app-artists-library',
  templateUrl: './artists-library.component.html',
  styleUrls: ['./artists-library.component.scss'],
  providers: [ArtistsService, AlbumsService, ImagesService],
  animations: [routerAnimation]
})
export class ArtistsLibraryComponent implements OnInit {
  constructor(
    private readonly service: ArtistsService
  ) {}

  ngOnInit(): void {
    this.service.loadArtists();
  }

}
