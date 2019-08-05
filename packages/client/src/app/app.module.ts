import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ArtistsLibraryModule } from './artists-library/artists-library.module';
import { AppNavBarComponent } from './nav-bar/app-nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StatusInterceptor } from './http-interceptors/status-interceptor';
import { StatusService } from './services/status.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AuthModule } from './auth/auth.module';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, AppNavBarComponent],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatToolbarModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AuthModule,

    ArtistsLibraryModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule.forRoot()
  ],
  providers: [
    StatusService,
    { provide: HTTP_INTERCEPTORS, useClass: StatusInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
