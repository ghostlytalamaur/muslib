import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArtistsLibraryComponent} from './artists-library/artists-library.component';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';
import {ArtistsListComponent} from './artists-lists/artists-list.component';

const childRoutes: Routes =
  [
    {path: '', component: ArtistsListComponent},
    {path: 'new', component: ArtistEditComponent}
  ];

const routes: Routes = [
  {path: 'library', component: ArtistsLibraryComponent, children: childRoutes},
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
