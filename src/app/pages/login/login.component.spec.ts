import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { UserService } from '../../services/user/user.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let routerMock: jasmine.SpyObj<Router>;
  let store: MockStore;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: ['ROLE_USER'],
  };

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['login', 'getProfile', 'findUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore(),
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate to home on successful login', () => {
    const mockToken = { token: 'mockToken' };
    const mockUser = {
      id: '1',
      username: 'Test User',
      email: 'test@example.com',
      roles: [{ name: 'ROLE_USER' }],
    };
  
    userServiceMock.login.and.returnValue(of(mockToken));
    userServiceMock.getProfile.and.returnValue(of(mockUser));
  
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
  
    component.onSubmit();
  
    expect(userServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(userServiceMock.getProfile).toHaveBeenCalled();
  
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
  

  it('should alert and log error on login failure', () => {
    spyOn(window, 'alert');
    userServiceMock.login.and.returnValue(throwError(() => ({ message: 'Login failed' })));

    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });
    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    expect(window.alert).toHaveBeenCalledWith('Login failed. Please try again.');
  });

  it('should alert and log error on profile fetch failure', () => {
    spyOn(window, 'alert');
    const mockToken = { token: 'mockToken' };
    const mockError = { message: 'Profile fetch failed' };

    userServiceMock.login.and.returnValue(of(mockToken));
    userServiceMock.getProfile.and.returnValue(throwError(() => mockError));

    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(userServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(userServiceMock.getProfile).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Failed to fetch profile. Please try again.');
  });
});
