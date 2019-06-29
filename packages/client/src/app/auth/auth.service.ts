import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';
import { distinctUntilChanged, map, skipWhile } from 'rxjs/operators';
import { auth } from 'firebase/app';

@Injectable()
export class AuthService {
  readonly user$: Observable<User | null>;
  private readonly mUser: BehaviorSubject<User | null | undefined>;

  constructor(private readonly fireAuth: AngularFireAuth) {
    this.mUser = new BehaviorSubject<User | null | undefined >(undefined);
    // @ts-ignore
    this.user$ = this.mUser
      .asObservable()
      .pipe(
        skipWhile(value => value === undefined));

    this.fireAuth.user
      .pipe(
        distinctUntilChanged(
          (x, y) => !!(x && y && x.uid === y.uid && x.displayName === y.displayName)
        ),
        map(u => {
          if (u) {
            return new User(u.uid, u.displayName || '');
          } else {
            return null;
          }
        })
      )
      .subscribe(
        u => this.mUser.next(u),
        e => this.mUser.error(e),
        () => this.mUser.complete()
      );
  }

  get user(): User | null {
    if (this.mUser.value !== undefined) {
      return this.mUser.value;
    } else {
      return null;
    }
  }

  get idToken(): Observable<string | null> {
    return this.fireAuth.idToken;
  }

  login(): Promise<void> {
    return this.fireAuth.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(() => {
        return Promise.resolve();
      });
  }

  logout(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }
}
