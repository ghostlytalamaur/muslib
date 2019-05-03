import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Album} from '../../models/album';

@Component({
  selector: 'app-album-card',
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.scss']
})
export class AlbumCardComponent implements OnInit {

  @Input()
  album: Album;

  @Output()
  deleteAlbum: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  onDelete() {
    this.deleteAlbum.emit(this.album.id);
  }
}
