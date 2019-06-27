import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { ArtistDetailsComponent } from './artist-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MatDialogModule,
  MatMenuModule,
  MatTableModule
} from '@angular/material';
import { ArtistsService } from '../services/artists.service';
import { AlbumsService } from '../services/albums.service';
import { instance, mock, verify, when } from 'ts-mockito';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { of } from 'rxjs';
import { Artist } from '../../models/artist';
import { Album } from '../../models/album';

const data = [
  {
    artist: new Artist('artist1', 'Nightwish', of('')),
    albums: [
      new Album('album11', 1997, 'Angels Fall First', of(''), 'artist1'),
      new Album('album12', 1998, 'Oceanborn', of(''), 'artist1')
    ]
  },
  {
    artist: new Artist('artist2', 'Draconian', of('')),
    albums: [
      new Album('album21', 2003, 'Where Lovers Mourn', of(''), 'artist2'),
      new Album('album22', 2005, 'Arcane Rain Fell', of(''), 'artist2')
    ]
  }
];

function mockServices(): {
  artistsService: ArtistsService;
  albumsService: AlbumsService;
} {
  const artistsService = mock(ArtistsService);
  const albumsService = mock(AlbumsService);
  for (const dataSet of data) {
    when(artistsService.getArtist(dataSet.artist.id)).thenReturn(
      of(dataSet.artist)
    );

    for (const album of dataSet.albums) {
      when(albumsService.getAlbums(dataSet.artist.id)).thenReturn(
        of(dataSet.albums)
      );
      when(
        albumsService.deleteAlbum(dataSet.artist.id, album.id)
      ).thenResolve();
    }
  }

  return { artistsService, albumsService };
}

describe('ArtistDetailsComponent', () => {
  let component: ArtistDetailsComponent;
  let fixture: ComponentFixture<ArtistDetailsComponent>;

  const {
    artistsService: artistServiceMock,
    albumsService: albumsServiceMock
  } = mockServices();
  const activatedRoute = new ActivatedRouteStub({ id: data[0].artist.id });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        SharedModule
      ],
      declarations: [ArtistDetailsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ArtistsService,
          useFactory: () => instance(artistServiceMock)
        },
        {
          provide: AlbumsService,
          useFactory: () => instance(albumsServiceMock)
        },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get artist by id', fakeAsync(() => {
    let actualArtist: Artist = null;
    component.artist$.subscribe(artist => (actualArtist = artist));
    tick();
    expect(actualArtist).toBe(data[0].artist, 'testArtist expected.');
  }));

  it('should get artist related albums', fakeAsync(() => {
    let actualAlbums: Album[] = null;
    component.albums$.subscribe(albums => (actualAlbums = albums));
    tick();
    expect(actualAlbums).toBe(data[0].albums, 'testAlbums expected.');
  }));

  it('should delete album', () => {
    component.onDeleteAlbum(data[0].albums[0].id);
    verify(
      albumsServiceMock.deleteAlbum(data[0].artist.id, data[0].albums[0].id)
    ).once();
  });

  it('should update artist when id in route paramMap changed', fakeAsync(() => {
    let actualArtist: Artist = null;
    let actualAlbums: Album[] = null;
    component.artist$.subscribe(artist => (actualArtist = artist));
    component.albums$.subscribe(albums => (actualAlbums = albums));
    activatedRoute.setParamMap({ id: data[1].artist.id });
    tick();
    expect(actualArtist).toBe(data[1].artist, `Invalid artist.`);
    expect(actualAlbums).toBe(data[1].albums, `Invalid albums`);
  }));
});
