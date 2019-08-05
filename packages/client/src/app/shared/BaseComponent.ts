import { OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class BaseComponent implements OnDestroy {
  private readonly aliveSubject$ = new Subject<void>();
  protected alive$: Observable<void> = this.aliveSubject$.asObservable();

  ngOnDestroy(): void {
    console.log(BaseComponent.name, '.ngOnDestroy()');
    this.aliveSubject$.next();
    this.aliveSubject$.complete();
  }
}
