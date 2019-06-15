import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface FormValue {
  name: string;
  year: number;
}

export interface NewAlbumData {
  name: string;
  year: number;
  image: File;
}

@Component({
  selector: 'app-new-album-dialog',
  templateUrl: './new-album-dialog.component.html',
  styleUrls: ['./new-album-dialog.component.scss']
})
export class NewAlbumDialogComponent implements OnInit {
  form: FormGroup;
  imageFile: File;

  constructor(
    private dialogRef: MatDialogRef<NewAlbumDialogComponent, NewAlbumData>
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      year: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\d]{4}$/gm)
      ])
    });
  }

  onSubmit(): void {
    const formValue: FormValue = this.form.value;
    this.dialogRef.close({
      name: formValue.name,
      year: formValue.year,
      image: this.imageFile
    });
  }
}
