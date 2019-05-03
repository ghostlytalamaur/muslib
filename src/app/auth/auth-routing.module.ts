import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginComponent} from './login-component/login.component';
import {ProfileComponent} from './profile/profile.component';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard]
})
export class AuthRoutingModule {
}
