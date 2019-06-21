import { Observable } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import { IdHolder } from './id-holder';

export class Artist implements IdHolder {
  readonly image$: Observable<string>;

  constructor(
    readonly id: string,
    readonly name: string,
    image: Observable<string>,
    readonly mbid?: string,
  ) {
    this.image$ = image.pipe(
      publishReplay(1),
      refCount()
    );
  }
}
