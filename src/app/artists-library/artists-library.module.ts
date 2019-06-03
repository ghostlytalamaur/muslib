import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtistsLibraryComponent} from './artists-library/artists-library.component';
import {ArtistsLibraryRoutingModule} from './artists-library-routing.module';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {ArtistCardComponent} from './artist-card/artist-card.component';
import {ArtistEditComponent} from './artist-edit/artist-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ArtistsListComponent} from './artists-lists/artists-list.component';
import {SharedModule} from '../shared/shared.module';
import {ArtistDetailsComponent} from './artist-details/artist-details.component';
import {AlbumListComponent} from './album-list/album-list.component';
import {NewAlbumDialogComponent} from './new-album-dialog/new-album-dialog.component';
import {AlbumCardComponent} from './album-card/album-card.component';
import { NewArtistDialogComponent } from './new-artist-dialog/new-artist-dialog.component';

@NgModule({
  declarations: [
    ArtistsLibraryComponent,
    ArtistCardComponent,
    ArtistEditComponent,
    ArtistsListComponent,
    ArtistDetailsComponent,
    AlbumListComponent,
    AlbumCardComponent,
    NewAlbumDialogComponent,
    NewArtistDialogComponent
  ],
  entryComponents: [
    NewAlbumDialogComponent,
    NewArtistDialogComponent
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
    MatToolbarModule,
    MatDialogModule,
    MatTableModule
  ]
})
export class ArtistsLibraryModule { }
