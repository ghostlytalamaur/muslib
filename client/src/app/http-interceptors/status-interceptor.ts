import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay, finalize } from 'rxjs/operators';
import { StatusService } from '../services/status.service';

@Injectable()
export class StatusInterceptor implements HttpInterceptor {
  constructor(private statusService: StatusService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.statusService.startOperation();
    return next
      .handle(req)
      .pipe(finalize(() => this.statusService.endOperation()));
  }
}
