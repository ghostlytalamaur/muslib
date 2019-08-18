import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistCardComponent } from './artist-card.component';
import { MatCard, MatCardModule, MatMenuModule } from '@angular/material';
import { createArtist } from '../../models/artist';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { spy, verify } from 'ts-mockito';
import { createImage, ImageType } from '../../models/image';

describe('ArtistCardComponent', () => {
  let component: ArtistCardComponent;
  let fixture: ComponentFixture<ArtistCardComponent>;
  const image = createImage(ImageType.FireStorage, 'artist1_image', 'assets/album.jpg');
  const artist = createArtist('artist1', 'Nightwish', image);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatMenuModule,
        MatCardModule,
        SharedModule
      ],
      declarations: [ArtistCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistCardComponent);
    component = fixture.componentInstance;
    component.artist = artist;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle null input', () => {
    component.artist = undefined;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show artist name in header', () => {
    const headerTextEl = fixture.debugElement.query(By.css('.title-text'))
      .nativeElement;
    expect(headerTextEl.textContent).toBe(artist.name);
  });

  it('should show artist image', () => {
    const imageEl = fixture.debugElement.query(
      By.css('.artist-image-container > img')
    ).nativeElement as HTMLImageElement;
    expect(imageEl.src).toContain(image);
  });

  it('should emit deleteArtist event', () => {
    const deleteArtistSpy = spy(component.deleteArtist);

    const card = fixture.debugElement.query(By.directive(MatCard));
    (card.nativeElement as HTMLElement).dispatchEvent(
      new MouseEvent('contextmenu')
    );

    const deleteBtn = fixture.debugElement.query(By.css('#deleteButton'));
    expect(deleteBtn).toBeTruthy('Delete button not found.');

    deleteBtn.nativeElement.click();

    verify(deleteArtistSpy.emit(artist.id)).once();
  });
});
