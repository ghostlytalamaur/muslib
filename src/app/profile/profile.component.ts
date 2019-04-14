import {Component, OnInit} from '@angular/core';
import {LastFmService} from '../lastfm/last-fm.service';
import {Observable, throwError} from 'rxjs';
import {UserInfo} from '../lastfm/models/user-info';
import {catchError} from 'rxjs/operators';
import {User} from '../lastfm/user';

@Component({
  selector: 'app-auth',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userInfo$: Observable<UserInfo>;
  error: string;


  constructor(
    private lastFm: LastFmService,
    private user: User
  ) {
    this.userInfo$ = this.lastFm.user.getInfo(this.user).pipe(
      catchError((err: Error) => {
        this.error = err.message;
        return throwError(err);
      })
    );
  }

  ngOnInit() {
  }

}
