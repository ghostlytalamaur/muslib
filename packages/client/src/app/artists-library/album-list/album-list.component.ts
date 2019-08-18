import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Album } from '../../models/album';
import { getImageUrlFromMap, ImagesMap } from '../../models/image';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumListComponent implements OnInit {

  @Input()
  albums: Album[];

  @Input()
  images: ImagesMap;

  constructor() {}

  ngOnInit(): void {}

  trackItems(index: number, album: Album): string {
    return album.id;
  }

  getImage(album: Album): string {
    return getImageUrlFromMap(this.images, album.image);
  }
}
