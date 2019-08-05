import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArtistsStorageService } from '../services/artists-storage.service';

interface FormValue {
  name: string;
}

@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.scss']
})
export class ArtistEditComponent implements OnInit {
  form: FormGroup;
  private imageFile: File;

  constructor(private service: ArtistsStorageService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    const formValue: FormValue = this.form.value;
    this.service
      .addArtist(formValue.name, this.imageFile)
      .catch(e => console.log(`Cannot add artist ${formValue.name}`, e));
    this.gotoParent();
  }

  private gotoParent(): void {
    this.router
      .navigate(['../'])
      .catch(err => console.log('Cannot navigate to parent.', err));
  }
}
