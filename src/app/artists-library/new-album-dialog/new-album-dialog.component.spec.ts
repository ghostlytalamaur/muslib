import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewAlbumData, NewAlbumDialogComponent} from './new-album-dialog.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {By} from '@angular/platform-browser';

describe('NewAlbumDialogComponent', () => {
  let component: NewAlbumDialogComponent;
  let fixture: ComponentFixture<NewAlbumDialogComponent>;
  const dialogRefMock = jasmine.createSpyObj<MatDialogRef<NewAlbumDialogComponent, NewAlbumData>>('dialogMock', [
    'close'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewAlbumDialogComponent],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefMock}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAlbumDialogComponent);
    component = fixture.componentInstance;

    const controls = fixture.debugElement.queryAll(By.css('input'));
    console.log(controls.map(control => control.name));
    console.log(controls);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
