import {NgModule} from '@angular/core';
import {LoginComponent} from './login-component/login.component';
import {AuthService} from './auth.service';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {ProfileButtonComponent} from './profile-button/profile-button.component';
import {MatButtonModule} from '@angular/material';
import {AuthRoutingModule} from './auth-routing.module';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile/profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    AngularFireAuthModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    ProfileComponent,
    ProfileButtonComponent
  ],
  exports: [
    ProfileButtonComponent
  ],
  providers: [
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class AuthModule {
}
