import {Observable} from 'rxjs';
import {publishReplay, refCount} from 'rxjs/operators';

export class Artist {

  readonly image$: Observable<string>;

  constructor(
    readonly id: string,
    readonly name: string,
    image: Observable<string>
  ) {
    this.image$ = image.pipe(
      publishReplay(1),
      refCount()
    );
  }
}
