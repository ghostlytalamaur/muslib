import {Component, OnInit} from '@angular/core';
import {ArtistsService} from '../artists.service';

@Component({
  selector: 'app-artists-library',
  templateUrl: './artists-library.component.html',
  styleUrls: ['./artists-library.component.scss'],
  providers: [
    ArtistsService
  ]
})
export class ArtistsLibraryComponent implements OnInit {



  constructor(
  ) {}

  ngOnInit() {
  }
}
