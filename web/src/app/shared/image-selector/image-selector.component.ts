import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

function isInputElement(eventTarget: any): eventTarget is HTMLInputElement {
  return eventTarget instanceof HTMLInputElement;
}

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {

  @Input()
  image = '';

  @Input()
  altText = 'Image';

  @Output()
  imageSelected: EventEmitter<File> = new EventEmitter<File>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
    if (!isInputElement(event.target) || event.target.files.length === 0) {
      return;
    }

    const image = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.image = (e.target as FileReader).result as string;
    reader.readAsDataURL(image);
    this.imageSelected.emit(image);
  }
}
