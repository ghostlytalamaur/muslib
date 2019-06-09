import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login-component/login.component';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuard} from './auth.guard';
import {UserLoggedInGuard} from './logged-in.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [UserLoggedInGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard, UserLoggedInGuard]
})
export class AuthRoutingModule {
}
