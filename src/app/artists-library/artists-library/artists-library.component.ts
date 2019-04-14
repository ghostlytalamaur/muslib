import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../lastfm/user';
import {LastFmService} from '../../lastfm/last-fm.service';
import {TopArtists} from '../../lastfm/models/top-artists';
import {interval, Observable, Subscription} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';
import {finalize, publishReplay, refCount, shareReplay, take} from 'rxjs/operators';

@Component({
  selector: 'app-artists-library',
  templateUrl: './artists-library.component.html',
  styleUrls: ['./artists-library.component.scss']
})
export class ArtistsLibraryComponent implements OnInit, OnDestroy {

  topArtists$: Observable<TopArtists>;
  topArtists: TopArtists;
  subscription: Subscription;

  constructor(
    private user: User,
    private lastFm: LastFmService
  ) {}

  ngOnInit() {
    this.topArtists$ = this.lastFm.user.getTopArtists(this.user);
    this.subscription = this.topArtists$.subscribe(value => this.topArtists = value);
  }

  ngOnDestroy(): void {
    console.log('[ArtistsLibraryComponent] ngOnDestroy()');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
