import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

export function isLoggedIn(srv: AuthService): Promise<Boolean> {
  if (!srv) {
    return Promise.resolve(false);
  }
  return srv.user$
    .pipe(
      take(1),
      map(user => !!user),
      catchError(err => of(false))
    )
    .toPromise()
    .catch(err => false);
}
