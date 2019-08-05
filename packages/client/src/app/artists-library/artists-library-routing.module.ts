import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsLibraryComponent } from './artists-library/artists-library.component';
import { ArtistsListComponent } from './artists-lists/artists-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthModule } from '../auth/auth.module';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';

const childRoutes: Routes = [
  { path: '', component: ArtistsListComponent },
  // { path: 'new', component: ArtistEditComponent },
  { path: ':id', component: ArtistDetailsComponent }
];

const routes: Routes = [
  {
    path: 'library',
    component: ArtistsLibraryComponent,
    children: childRoutes,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [AuthModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistsLibraryRoutingModule {}
