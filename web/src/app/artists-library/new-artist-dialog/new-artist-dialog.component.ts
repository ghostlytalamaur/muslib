import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

export interface NewArtistData {
  name: string;
  image: File;
}

@Component({
  selector: 'app-new-artist-dialog',
  templateUrl: './new-artist-dialog.component.html',
  styleUrls: ['./new-artist-dialog.component.scss']
})
export class NewArtistDialogComponent implements OnInit {

  artistData: NewArtistData = {name: '', image: undefined};

  constructor(
    private dialogRef: MatDialogRef<NewArtistDialogComponent, NewArtistData>
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.dialogRef.close(this.artistData);
  }

  onImageSelected(image: File): void {
    this.artistData.image = image;
  }
}
