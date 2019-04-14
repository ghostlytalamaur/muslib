import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArtistsLibraryComponent} from './artists-library/artists-library.component';
import {ArtistsLibraryRoutingModule} from './artists-library-routing.module';
import {MatCardModule, MatProgressSpinnerModule} from '@angular/material';
import { ArtistCardComponent } from './artist-card/artist-card.component';

@NgModule({
  declarations: [
    ArtistsLibraryComponent,
    ArtistCardComponent
  ],
  imports: [
    CommonModule,
    ArtistsLibraryRoutingModule,
    MatProgressSpinnerModule,
    MatCardModule
  ]
})
export class ArtistsLibraryModule { }
