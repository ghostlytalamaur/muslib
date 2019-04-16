import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Artist} from '../../lastfm/models/artist';
import {MusicBrainzService} from '../../musicbrainz/music-brainz.service';
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
  onDeleteArtist: EventEmitter<string> = new EventEmitter<string>();

  albums$: Observable<Album[]>;

  constructor(private musicBrainz: MusicBrainzService) {
  }

  ngOnInit() {
    // this.albums$ = this.musicBrainz.getAlbums(this.artist.mbid);
  }

  onDelete() {
    this.onDeleteArtist.emit(this.artist.id);
  }
}
