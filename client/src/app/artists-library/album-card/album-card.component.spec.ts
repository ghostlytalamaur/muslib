import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCardComponent } from './album-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { of } from 'rxjs';

describe('AlbumCardComponent', () => {
  let component: AlbumCardComponent;
  let fixture: ComponentFixture<AlbumCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule, SharedModule],
      declarations: [AlbumCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumCardComponent);
    component = fixture.componentInstance;
    component.album = {
      artistId: '',
      year: 2019,
      name: 'Dummy album',
      id: 'id',
      image$: of('')
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
