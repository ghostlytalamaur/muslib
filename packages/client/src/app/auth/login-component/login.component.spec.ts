import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const user = new BehaviorSubject<User>(null);
  const authService = jasmine.createSpyObj<AuthService>('authSpy', {
    user(): User | null {
      return user.value;
    },
    user$: user.asObservable(),
    login: Promise.resolve()
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login when google sign-in button clicked', () => {
    const btnDe = fixture.debugElement.query(By.css('.google-sign-in'));
    expect(btnDe).toBeTruthy('Cannot find google-sign-in button');
    (btnDe.nativeElement as HTMLElement).dispatchEvent(new MouseEvent('click'));
    expect(authService.login).toHaveBeenCalledTimes(1);
  });
});
