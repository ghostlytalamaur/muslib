import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Artist } from '../../models/artist';

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

  ngOnInit(): void {
  }

  onDelete(): void {
    this.deleteArtist.emit(this.artist.id);
  }
}
