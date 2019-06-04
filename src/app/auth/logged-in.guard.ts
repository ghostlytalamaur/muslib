import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import * as utils from './auth.utils';

@Injectable()
export class UserLoggedInGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return utils.isLoggedIn(this.authService)
      .then(isLoggedIn => {
        if (isLoggedIn) {
          return this.router.createUrlTree(['/library']);
        } else {
          return true;
        }
      })
  }

}
