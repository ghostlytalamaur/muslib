import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ArtistsService} from '../artists.service';
import {Router} from '@angular/router';

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
  // base64
  private imagePreview: string;

  constructor(
    private service: ArtistsService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    const formValue: FormValue = this.form.value;
    this.service.addArtist(formValue.name, this.imageFile)
      .catch(() => console.log(`Cannot add artist ${formValue.name}`));
    this.gotoParent();
  }

  onFileSelected(event) {
    if (!event || !event.target || !event.target.files) {
      return;
    }

    this.imageFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = e => this.imagePreview = (e.target as FileReader).result as string;
    reader.readAsDataURL(this.imageFile);
  }

  private gotoParent() {
    this.router.navigate(['../'])
      .catch((err) => console.log('Cannot navigate to parent.', err));
  }

}
