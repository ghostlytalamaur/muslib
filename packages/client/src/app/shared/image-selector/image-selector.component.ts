import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';

function isInputElement(eventTarget: any): eventTarget is HTMLInputElement {
  return eventTarget instanceof HTMLInputElement;
}

function isValidImage(image: File): boolean {
  const fileTypes = ['image/jpeg', 'image/png'];

  return !!fileTypes.find(value => image.type.toLowerCase() === value);
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

  @ViewChild('fileChooser', { static: false })
  fileChooser: ElementRef<HTMLInputElement>;

  private errorText: string;
  private dragCounter = 0;

  constructor() {}

  ngOnInit(): void {}

  private handleFiles(files: FileList): void {
    console.log('[handleFiles]', files);
    if (files.length === 0) {
      return;
    }

    if (!isValidImage(files[0])) {
      this.errorText = 'Invalid file type';
      this.imageSelected.emit(null);
      console.log('Error:', this.errorText);
      return;
    }
    this.errorText = '';
    const image = files[0];
    const reader = new FileReader();
    reader.onload = e =>
      (this.image = (e.target as FileReader).result as string);
    reader.readAsDataURL(image);
    this.imageSelected.emit(image);
  }

  get isDrag(): boolean {
    return this.dragCounter > 0;
  }

  onFileSelected(event: Event): void {
    console.log('onFileSelected()', event);
    if (!isInputElement(event.target)) {
      return;
    }
    this.handleFiles(event.target.files);
  }

  onDragOver(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragLeave(event: Event): void {
    this.dragCounter--;
  }

  onDragEnter(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.dragCounter++;
  }

  onDrop(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.dragCounter--;
    if (event.dataTransfer.files.length === 0) {
      return;
    }

    this.clearImage();
    this.handleFiles(event.dataTransfer.files);
  }

  clearImage(): void {
    this.fileChooser.nativeElement.value = null;
    this.image = undefined;
    this.imageSelected.emit(null);
  }

  getError(): string {
    return this.errorText;
  }
}
