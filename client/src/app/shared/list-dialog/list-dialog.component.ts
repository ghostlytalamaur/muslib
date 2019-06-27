import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface ListDialogData {
  title: string;
  names: string[];
  selected: number;
}

export interface ListDialogResult {
  selected: number;
}

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.scss']
})
export class ListDialogComponent implements OnInit {

  selected: string;

  constructor(
    private dialogRef: MatDialogRef<ListDialogComponent, ListDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: ListDialogData) {
    if (this.data.selected !== undefined) {
      this.selected = this.data.names[this.data.selected];
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const selectedIndex = this.data.names.findIndex(v => v === this.selected);
    this.dialogRef.close({selected: selectedIndex});
  }

}
