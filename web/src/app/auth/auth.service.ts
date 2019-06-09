import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from './user';
import {distinctUntilChanged, map, skipWhile} from 'rxjs/operators';
import {auth} from 'firebase/app';

@Injectable()
export class AuthService {

  readonly user$: Observable<User | null>;
  private readonly mUser: BehaviorSubject<User | null>;

  constructor(
    private readonly fireAuth: AngularFireAuth
  ) {
    this.mUser = new BehaviorSubject<User>(undefined);
    this.user$ = this.mUser.asObservable().pipe(
      skipWhile(value => value === undefined)
    );

    this.fireAuth.user.pipe(
      distinctUntilChanged((x, y) => x && y && x.uid === y.uid && x.displayName === y.displayName),
      map((u => {
        if (u) {
          return new User(u.uid, u.displayName);
        } else {
          return null;
        }
      })),
    ).subscribe(
      (u) => this.mUser.next(u),
      (e) => this.mUser.error(e),
      () => this.mUser.complete()
    );
  }

  get user(): User | null {
    return this.mUser.value;
  }

  get idToken(): Observable<string> {
    return this.fireAuth.idToken;
  }
  
  login(): Promise<void> {
    return this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(() => {
        return Promise.resolve();
      });
  }

  logout(): Promise<void> {
    return this.fireAuth.auth.signOut();
  }
}
