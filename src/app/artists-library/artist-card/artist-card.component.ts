import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Artist} from '../../lastfm/models/artist';
import {Observable} from 'rxjs';
import {Album} from '../../musicbrainz/models/album';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit {

  @Input()
  artist: Artist;

  @Output()
  deleteArtist: EventEmitter<string> = new EventEmitter<string>();

  albums$: Observable<Album[]>;

  constructor() {
  }

  ngOnInit() {
  }

  onDelete() {
    this.deleteArtist.emit(this.artist.id);
  }
}
