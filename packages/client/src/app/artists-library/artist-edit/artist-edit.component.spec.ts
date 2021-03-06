import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistEditComponent } from './artist-edit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ArtistsStorageService } from '../services/artists.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArtistEditComponent', () => {
  let component: ArtistEditComponent;
  let fixture: ComponentFixture<ArtistEditComponent>;
  const artistService = jasmine.createSpyObj<ArtistsStorageService>('artistService', {
    addArtist: Promise.resolve('dummy')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ArtistEditComponent],
      providers: [{ provide: ArtistsStorageService, useValue: artistService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
