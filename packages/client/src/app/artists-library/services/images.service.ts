import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromMuslib from '../store/ngrx/muslib.reducer';
import { Observable } from 'rxjs';
import { ImagesMap } from '../../models/image';

@Injectable()
export class ImagesService {

  constructor(
    private readonly store: Store<fromMuslib.State>
  ) {}

  getImages(): Observable<ImagesMap> {
    return this.store.select(fromMuslib.getImagesMap);
  }
}
