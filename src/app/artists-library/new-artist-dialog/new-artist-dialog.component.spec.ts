import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewArtistDialogComponent } from './new-artist-dialog.component';

describe('NewArtistDialogComponent', () => {
  let component: NewArtistDialogComponent;
  let fixture: ComponentFixture<NewArtistDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewArtistDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArtistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
