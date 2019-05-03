import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {User} from '../user';

@Component({
  selector: 'app-auth',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  error: string;
  user$: Observable<User | null>;


  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.user$ = authService.user$;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout()
      .then(() => this.router.navigate(['login']))
      .catch(reason => console.log('Cannot sign out.', reason));
  }
}
