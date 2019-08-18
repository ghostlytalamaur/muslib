import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Artist } from '../../models/artist';
import { getImageUrl, Image } from '../../models/image';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit {
  @Input()
  artist: Artist;

  @Input()
  image: Image;

  @Output()
  deleteArtist: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
  }

  onDelete(): void {
    this.deleteArtist.emit(this.artist.id);
  }

  getImage(): string {
    return getImageUrl(this.image);
  }
}
