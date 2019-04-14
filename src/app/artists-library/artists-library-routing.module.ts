import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArtistsLibraryComponent} from './artists-library/artists-library.component';

const routes: Routes = [
  {path: 'artists', component: ArtistsLibraryComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ArtistsLibraryRoutingModule {}
