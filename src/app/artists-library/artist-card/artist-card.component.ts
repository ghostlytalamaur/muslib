import {Component, Input, OnInit} from '@angular/core';
import {Artist} from '../../lastfm/models/artist';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit {

  @Input()
  artist: Artist;

  constructor() { }

  ngOnInit() {
  }

}
