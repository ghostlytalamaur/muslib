import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNavBarComponent } from './app-nav-bar.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterLinkStubDirective } from '../testing/router-link-stub.directive';
import { StatusService } from '../services/status.service';
import {
  MatProgressBar,
  MatProgressBarModule,
  MatToolbarModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppNavBarComponent', () => {
  const expectedLinks: string[] = ['library'];
  let component: AppNavBarComponent;
  let fixture: ComponentFixture<AppNavBarComponent>;
  let linksDe: DebugElement[];
  let routerLinks: RouterLinkStubDirective[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatToolbarModule, MatProgressBarModule],
      declarations: [AppNavBarComponent, RouterLinkStubDirective],
      providers: [StatusService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    linksDe = fixture.debugElement.queryAll(
      By.directive(RouterLinkStubDirective)
    );
    routerLinks = linksDe.map(de => de.injector.get(RouterLinkStubDirective));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have proper links', () => {
    expect(routerLinks.length).toBe(expectedLinks.length);
    for (let i = 0; i < expectedLinks.length; i++) {
      expect(routerLinks[i].linkParams).toBe(
        expectedLinks[i],
        `Invalid navigation link #${i}`
      );
    }
  });

  it('should navigate to Library', () => {
    for (let i = 0; i < expectedLinks.length; i++) {
      expect(routerLinks[i].navigatedUrl).toBeUndefined(
        `link #${i} should not have navigated url before click`
      );
      (linksDe[i].nativeElement as HTMLElement).dispatchEvent(
        new MouseEvent('click')
      );
      expect(routerLinks[i].navigatedUrl).toBe(
        expectedLinks[i],
        `link #${i} should have proper navigated url after click`
      );
    }
  });

  it('should show/hide progress bar according to active operations', () => {
    const srv = fixture.debugElement.injector.get(StatusService);
    expect(fixture.debugElement.query(By.directive(MatProgressBar))).toBeFalsy(
      'progress bar should not shows without running operations'
    );
    srv.startOperation();
    try {
      fixture.detectChanges(); // give a chance to show progress bar
      expect(
        fixture.debugElement.query(By.directive(MatProgressBar))
      ).toBeTruthy('progress bar should shows when has running operations');
    } finally {
      srv.endOperation();
    }
  });
});
