import {Observable} from 'rxjs';
import {publish, refCount} from 'rxjs/operators';

export class Album {

  readonly image$: Observable<string>;

  constructor(
    readonly id: string,
    readonly year: number,
    readonly name: string,
    image: Observable<string>,
    readonly artistId: string
  ) {
    this.image$ = image.pipe(
      publish(),
      refCount()
    );
  }
}
