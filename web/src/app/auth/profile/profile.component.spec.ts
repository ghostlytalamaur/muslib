import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ProfileComponent} from './profile.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {instance, mock, when} from 'ts-mockito';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../auth.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../user';
import {By} from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let routerSpy: jasmine.Spy;
  const authService = mock(AuthService);
  const user = new BehaviorSubject<User>(null);
  when(authService.user$).thenReturn(user);
  when(authService.user).thenReturn(user.value);
  when(authService.logout()).thenResolve();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ProfileComponent],
      providers: [
        {provide: AuthService, useFactory: () => instance(authService)}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    user.next(new User('userId', 'Test User'));
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerSpy = spyOn(fixture.debugElement.injector.get(Router), 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show logout button when user signed in', () => {
    const logoutBtn = fixture.debugElement.query(By.css('button'));
    expect(logoutBtn).toBeTruthy();
  });

  it('should show user name when user signed in', () => {
    const userNameDe = fixture.debugElement.query(By.css('.user-name'));
    expect(userNameDe).toBeTruthy('cannot find user-name element');
    expect((userNameDe.nativeElement as HTMLElement).textContent).toContain(user.value.displayName);
  });

  it('should hide logout button when user signed out', () => {
    user.next(null);
    fixture.detectChanges();
    const logoutBtn = fixture.debugElement.query(By.css('button'));
    expect(logoutBtn).toBeFalsy();
  });

  it('should navigate to login screen after logout', fakeAsync(() => {
    const logoutBtn = fixture.debugElement.query(By.css('button'));
    (logoutBtn.nativeElement as HTMLElement).dispatchEvent(new MouseEvent('click'));

    tick();
    expect(routerSpy).toHaveBeenCalledWith(['login']);
    expect(routerSpy).toHaveBeenCalledTimes(1);
  }));

});
