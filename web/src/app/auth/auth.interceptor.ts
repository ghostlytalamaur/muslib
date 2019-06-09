import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes(environment.server.url)) {
            return this.authService.idToken.pipe(
                switchMap((idToken) => {
                    console.log('[AuthInterceptor] append authorization header');
                    const authReq = req.clone({
                        headers: req.headers.append('Authorization', `Bearer ${idToken}`)
                    });
                    return next.handle(authReq);
                })
            );
        } else {
            return next.handle(req);
        }
    }
}