import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable()
export class StatusService {

  private operationCounter = 0;
  private isRunning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isRunning$: Observable<boolean> = this.isRunning.asObservable();


  startOperation() {
    this.operationCounter++;
    console.log('[StatusService] startOperation(); operationCounter = ', this.operationCounter);
    if (this.operationCounter === 1) {
      this.isRunning.next(true);
    }
  }

  endOperation() {
    this.operationCounter--;
    console.log('[StatusService] endOperation(); operationCounter = ', this.operationCounter);
    if (this.operationCounter === 0) {
      this.isRunning.next(false);
    }
  }
}
