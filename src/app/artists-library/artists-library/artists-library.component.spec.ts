import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsLibraryComponent } from './artists-library.component';

describe('ArtistsLibraryComponent', () => {
  let component: ArtistsLibraryComponent;
  let fixture: ComponentFixture<ArtistsLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistsLibraryComponent ]
    })
    .compileComponents();
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
