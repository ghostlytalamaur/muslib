import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsLibraryComponent } from './artists-library.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ArtistsLibraryComponent', () => {
  let component: ArtistsLibraryComponent;
  let fixture: ComponentFixture<ArtistsLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistsLibraryComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
