import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtistsLibraryComponent} from './artists-library/artists-library.component';
import {ArtistsLibraryRoutingModule} from './artists-library-routing.module';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';
import {ArtistCardComponent} from './artist-card/artist-card.component';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ArtistsListComponent} from './artists-lists/artists-list.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ArtistsLibraryComponent,
    ArtistCardComponent,
    ArtistEditComponent,
    ArtistsListComponent
  ],
  imports: [
    CommonModule,
    ArtistsLibraryRoutingModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    SharedModule,
    MatToolbarModule
  ]
})
export class ArtistsLibraryModule { }
