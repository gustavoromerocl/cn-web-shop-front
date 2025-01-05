import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock del servicio UserService
    userServiceSpy = jasmine.createSpyObj('UserService', ['registerUser']);
    // Mock del Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent], // Importa el componente standalone aquí
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with empty fields and validators', () => {
      const form = component.registerForm;
      expect(form).toBeDefined();
      expect(form.get('name')?.valid).toBeFalse();
      expect(form.get('email')?.valid).toBeFalse();
      expect(form.get('password')?.valid).toBeFalse();
      expect(form.get('confirmPassword')?.valid).toBeFalse();
    });
  });

  describe('Custom Validators', () => {
    it('should validate uppercase letters in the password', () => {
      const control = component.registerForm.get('password');
      control?.setValue('lowercase1@');
      expect(control?.hasError('uppercase')).toBeTrue();
      control?.setValue('Uppercase1@');
      expect(control?.hasError('uppercase')).toBeFalse();
    });

    it('should validate numbers in the password', () => {
      const control = component.registerForm.get('password');
      control?.setValue('NoNumbers@');
      expect(control?.hasError('number')).toBeTrue();
      control?.setValue('HasNumber1@');
      expect(control?.hasError('number')).toBeFalse();
    });

    it('should validate special characters in the password', () => {
      const control = component.registerForm.get('password');
      control?.setValue('NoSpecial1');
      expect(control?.hasError('specialCharacter')).toBeTrue();
      control?.setValue('HasSpecial1@');
      expect(control?.hasError('specialCharacter')).toBeFalse();
    });
  });

  describe('Password Match Validator', () => {
    it('should validate that passwords match', () => {
      const form = component.registerForm;
      form.get('password')?.setValue('Password1@');
      form.get('confirmPassword')?.setValue('Mismatch1@');
      expect(form.hasError('mismatch')).toBeTrue();

      form.get('confirmPassword')?.setValue('Password1@');
      expect(form.hasError('mismatch')).toBeFalse();
    });
  });

  describe('Form Submission', () => {
    it('should call registerUser and navigate to login on successful registration', () => {
      const mockResponse = { success: true };
      userServiceSpy.registerUser.and.returnValue(of(mockResponse));

      component.registerForm.setValue({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1@',
        confirmPassword: 'Password1@',
      });

      component.onSubmit();

      expect(userServiceSpy.registerUser).toHaveBeenCalledWith({
        username: 'Test User',
        email: 'test@example.com',
        password: 'Password1@',
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle registration errors', () => {
      userServiceSpy.registerUser.and.returnValue(throwError(() => new Error('Registration failed')));

      component.registerForm.setValue({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password1@',
        confirmPassword: 'Password1@',
      });

      spyOn(window, 'alert'); // Espía para la alerta

      component.onSubmit();

      expect(userServiceSpy.registerUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Registration failed. Please try again.');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to the login page', () => {
      component.navigateToLogin();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
