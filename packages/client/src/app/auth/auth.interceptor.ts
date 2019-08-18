import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';
import { sharedEnvironment } from '@muslib/shared';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(sharedEnvironment.server.url)) {
      return this.authService.idToken.pipe(
        take(1),
        switchMap(idToken => {
          let authReq = req;
          if (idToken) {
            authReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${idToken}`)
            });
          }
          return next.handle(authReq);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
