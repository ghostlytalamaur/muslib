import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ArtistsListComponent} from './artists-list.component';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {ArtistsService} from '../services/artists.service';
import {BehaviorSubject, of} from 'rxjs';
import {Artist} from '../../models/artist';
import {By} from '@angular/platform-browser';
import {ArtistCardComponent} from '../artist-card/artist-card.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCardModule, MatMenuModule} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

const TEST_ARTISTS = [
  new Artist('artist1', 'Nightwish', of('')),
  new Artist('artist2', 'Draconian', of(''))
];

describe('ArtistsListComponent', () => {
  let component: ArtistsListComponent;
  let fixture: ComponentFixture<ArtistsListComponent>;
  let cardsCont: DebugElement;
  const artists = new BehaviorSubject<Artist[]>(null);
  const artistService = jasmine.createSpyObj<ArtistsService>('artistServiceSpy', {
    getArtists: artists.asObservable(),
    deleteArtist: Promise.resolve()
  });
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatMenuModule,
        RouterTestingModule
      ],
      declarations: [
        ArtistsListComponent,
        ArtistCardComponent
      ],
      providers: [
        {provide: ArtistsService, useValue: artistService},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    artists.next(TEST_ARTISTS);
    fixture = TestBed.createComponent(ArtistsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    cardsCont = fixture.debugElement.query(By.css('.artists-container'));
    expect(cardsCont).toBeTruthy('Cannot find artists-container');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show artists', () => {
    const cards = cardsCont.queryAll(By.directive(ArtistCardComponent));
    expect(cards.length).toBe(TEST_ARTISTS.length, 'invalid artists count');
  });

  it('should update content when artists changed', () => {
    artists.next([...TEST_ARTISTS, new Artist('id3', 'TestArtist3', of(''))]);
    fixture.detectChanges();
    const cards = cardsCont.queryAll(By.directive(ArtistCardComponent));
    expect(cards.length).toBe(TEST_ARTISTS.length + 1, 'invalid artists count after emit');
  });

  it('should navigate to details by click on card', () => {
    const routerSpy = spyOn(fixture.debugElement.injector.get(Router), 'navigate')
      .and
      .returnValue(Promise.resolve());
    const card = cardsCont.query(By.directive(ArtistCardComponent));
    const cardComp = card.injector.get(ArtistCardComponent);
    (card.nativeElement as HTMLElement).dispatchEvent(new MouseEvent('click'));
    expect(routerSpy).toHaveBeenCalledWith([cardComp.artist.id], {relativeTo: activatedRoute});
  });

  it('should delete artist', () => {
    const card = cardsCont.query(By.directive(ArtistCardComponent));
    const cardComp = card.injector.get(ArtistCardComponent);
    cardComp.onDelete();
    expect(artistService.deleteArtist).toHaveBeenCalledWith(cardComp.artist.id);
  });
});
