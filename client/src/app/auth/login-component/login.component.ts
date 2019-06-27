import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly zone: NgZone
  ) {}

  ngOnInit(): void {}

  login(): void {
    this.authService
      .login()
      .then(() => this.zone.run(() => this.router.navigate(['/library'])))
      .catch(error => {
        console.log('Error while authorization.', error);
      });
  }
}
