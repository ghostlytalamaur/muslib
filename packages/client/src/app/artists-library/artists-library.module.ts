import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { ArtistCardComponent } from './artist-card/artist-card.component';
import { ArtistsLibraryRoutingModule } from './artists-library-routing.module';
import { ArtistsLibraryComponent } from './artists-library/artists-library.component';
import { ArtistsListComponent } from './artists-lists/artists-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MuslibApiModule } from 'src/server/api/muslib-api.module';
import { NewArtistDialogComponent } from './new-artist-dialog/new-artist-dialog.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { StoreModule } from '@ngrx/store';
import * as fromMuslib from './store/ngrx/muslib.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ArtistsEffects } from './store/ngrx/artists.effects';
import { ImagesEffects } from './store/ngrx/images.effects';

@NgModule({
  declarations: [
    ArtistsLibraryComponent,
    ArtistCardComponent,
    // ArtistEditComponent,
    ArtistsListComponent,
    ArtistDetailsComponent,
    AlbumListComponent,
    // NewAlbumDialogComponent,
    NewArtistDialogComponent
  ],
  entryComponents: [NewArtistDialogComponent],
  imports: [
    CommonModule,
    HttpClientModule,
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
    MatTableModule,
    MuslibApiModule,
    MatAutocompleteModule,
    MatTabsModule,
    StoreModule.forFeature(fromMuslib.muslibFeatureKey, fromMuslib.reducer),
    EffectsModule.forFeature([ArtistsEffects, ImagesEffects])
  ]
})
export class ArtistsLibraryModule {}
