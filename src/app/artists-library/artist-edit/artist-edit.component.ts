import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ArtistsService} from '../artists.service';

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

  constructor(
    private service: ArtistsService,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    console.log('[ArtistEditComponent] onSubmit()');
    const formValue: FormValue = this.form.value;
    this.service.addArtist(formValue.name, this.imageFile)
      .then(console.log, console.log);
  }

  onFileSelected(event) {
    if (!event || !event.target || !event.target.files) {
      return;
    }

    this.imageFile = event.target.files[0];
  }

}
