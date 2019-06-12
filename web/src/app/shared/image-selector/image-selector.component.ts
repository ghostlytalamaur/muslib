import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

function isInputElement(eventTarget: any): eventTarget is HTMLInputElement {
  return eventTarget instanceof HTMLInputElement;
}

function isValidImage(image: File): boolean {
  const fileTypes = [
    'image/jpeg',
    'image/png'
  ];

  console.log(image.type);
  return !!fileTypes.find(value => image.type.toLowerCase() === value);
}

type InfoType = 'itDefault' | 'itStatus' | 'itError';

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
  private errorText: string;
  private statusText: string;
  mouseOver: boolean;
  isDrag: boolean;
  currentClasses: {};

  constructor() {
  }

  ngOnInit(): void {
  }

  private handleFiles(files: FileList): void {
    if (files.length === 0) {
      return;
    }

    if (!isValidImage(files[0])) {
      this.errorText = 'Invalid file type.';
      this.imageSelected.emit(null);
      console.log('Error:', this.errorText);
      return;
    }
    this.errorText = '';
    const image = files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.image = (e.target as FileReader).result as string;
    reader.readAsDataURL(image);
    this.imageSelected.emit(image);
  }

  onFileSelected(event: Event): void {
    console.log('onFileSelected()', event);
    if (!isInputElement(event.target)) {
      return;
    }
    this.handleFiles(event.target.files);
  }

  onDragOver(event: Event): void {
    console.log('DragOver:', event);
    event.stopPropagation();
    event.preventDefault();
    this.statusText = 'Drop files here';
  }

  onDragLeave(event: Event): void {
    console.log('DragLeave:', event);
    this.statusText = undefined;
    this.isDrag = false;
    this.currentClasses = {};
  }

  onDragEnter(event: Event): void {
    console.log('DragEnter:', event);
    event.stopPropagation();
    event.preventDefault();
    this.isDrag = true;
    this.currentClasses = {'drag': true};
  }

  onDrop(event: DragEvent): void {
    console.log('onDrop:', event);
    event.stopPropagation();
    event.preventDefault();

    this.clearImage(null);
    this.statusText = undefined;
    this.handleFiles(event.dataTransfer.files);
    this.isDrag = false;
    this.currentClasses = {};
  }

  onMouseEnter(event: MouseEvent): void {
    this.mouseOver = true;
  }

  onMouseLeave(event: MouseEvent): void {
    this.mouseOver = undefined;
  }

  clearImage(fileChooser: HTMLInputElement): void {
    this.image = undefined;
    this.imageSelected.emit(null);
    if (fileChooser) {
      fileChooser.value = null;
    }
  }

  getInfo(): string {
    switch (this.getInfoType()) {
      case 'itError':
        return this.errorText;
      case 'itStatus':
        return this.statusText;
      default:
        return undefined;
    }
  }

  getInfoType(): InfoType {
    if (this.statusText) {
      return 'itStatus';
    } else if (this.errorText) {
      return 'itError';
    } else {
      return 'itDefault';
    }
  }

  log(...args: any[]): void {
    console.log(args);
  }
}
