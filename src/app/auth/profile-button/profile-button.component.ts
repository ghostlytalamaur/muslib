import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';
import {User} from '../user';

@Component({
  selector: 'app-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent implements OnInit {

  readonly user$: Observable<User | null>;

  constructor(
    private readonly authService: AuthService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
  }

}
