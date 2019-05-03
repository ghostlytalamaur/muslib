import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.login()
      .then(() => this.router.navigate(['../']))
      .catch(error => {
        console.log('Error while authorization.', error);
      });
  }
}
