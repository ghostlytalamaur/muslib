import { catchError, map, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

export function isLoggedIn(srv: AuthService): Promise<boolean> {
  if (!srv) {
    return Promise.resolve(false);
  }
  return srv.user$
    .pipe(
      take(1),
      map(user => !!user),
      catchError(_ => of(false))
    )
    .toPromise()
    .catch(_ => false);
}
