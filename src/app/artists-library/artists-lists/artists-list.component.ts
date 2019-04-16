import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Artist} from '../../lastfm/models/artist';
import {ArtistsService} from '../artists.service';

@Component({
  selector: 'app-artists-lists',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss']
})
export class ArtistsListComponent implements OnInit {

  artists$: Observable<Artist[]>;

  constructor(
    private service: ArtistsService
  ) { }

  ngOnInit() {
    this.artists$ = this.service.getArtists();
  }

  deleteArtist(id: string) {
    this.service.deleteArtist(id);
  }
}
