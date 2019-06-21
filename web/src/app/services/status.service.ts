import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class StatusService {
  private operationCounter = 0;
  private isRunning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isRunning$: Observable<boolean> = this.isRunning.asObservable();

  startOperation(): void {
    this.operationCounter++;
    if (this.operationCounter === 1) {
      this.isRunning.next(true);
    }
  }

  endOperation(): void {
    this.operationCounter--;
    if (this.operationCounter === 0) {
      this.isRunning.next(false);
    }
  }
}
