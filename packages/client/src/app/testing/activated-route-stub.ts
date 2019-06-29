import { Observable, ReplaySubject, Subject } from 'rxjs';
import { convertToParamMap, ParamMap, Params } from '@angular/router';

export class ActivatedRouteStub {
  private subject: Subject<ParamMap> = new ReplaySubject<ParamMap>();
  readonly paramMap: Observable<ParamMap> = this.subject.asObservable();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  setParamMap(params?: Params): void {
    if (params) {
      this.subject.next(convertToParamMap(params));
    } else {
      this.subject.next(undefined);
    }
  }
}
