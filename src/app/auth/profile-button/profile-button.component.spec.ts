import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileButtonComponent} from './profile-button.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {AuthService} from '../auth.service';
import {instance, mock, when} from 'ts-mockito';
import {BehaviorSubject} from 'rxjs';
import {User} from '../user';
import {By} from '@angular/platform-browser';

describe('ProfileButtonComponent', () => {
  let component: ProfileButtonComponent;
  let fixture: ComponentFixture<ProfileButtonComponent>;

  const authService = mock(AuthService);
  const user = new BehaviorSubject<User>(new User('userId', 'Test User'));
  when(authService.user$).thenReturn(user);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileButtonComponent],
      providers: [
        {provide: AuthService, useFactory: () => instance(authService)}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show user name when user signed in', () => {
    const linkEl = fixture.debugElement.query(By.css('a')).nativeElement as HTMLLinkElement;
    expect(linkEl.textContent).toBe(user.value.displayName);
  });

  it('should show Login text when user signed out', () => {
    user.next(null);
    fixture.detectChanges();
    const linkEl = fixture.debugElement.query(By.css('a')).nativeElement as HTMLLinkElement;
    expect(linkEl.textContent).toBe('Login');
  });
});
