import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service'; // Importa el servicio
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService, // Inyecta el servicio
    private router: Router,
    private readonly toastr: ToastrService,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['',       [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$"),
        ],],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.uppercaseValidator(),
            this.lowercaseValidator(),
            this.numberValidator(),
            this.specialCharacterValidator(),
            this.noWhitespaceValidator(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Custom Validator for Uppercase Letter
  uppercaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasUppercase = /[A-Z]/.test(control.value);
      return hasUppercase ? null : { uppercase: true };
    };
  }

  // Custom Validator for Number
  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasNumber = /\d/.test(control.value);
      return hasNumber ? null : { number: true };
    };
  }


  // Validador para letra minúscula
  lowercaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasLowercase = /[a-z]/.test(control.value);
      return hasLowercase ? null : { lowercase: true };
    };
  }

  // Validador para evitar espacios en blanco
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasWhitespace = /\s/.test(control.value);
      return hasWhitespace ? { whitespace: true } : null;
    };
  }

  // Validador actualizado para caracteres especiales
  specialCharacterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasSpecialCharacter = /[!@#$%^&*]/.test(control.value);
      return hasSpecialCharacter ? null : { specialCharacter: true };
    };
  }


  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      const newUser = { username: name, email, password };
  
      this.userService.registerUser(newUser).subscribe({
        next: (response) => {
          console.log('Registration Response:', response); // Verifica la respuesta en consola
          this.toastr.success('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error Details:', err); // Imprime el error completo
          this.toastr.error('Registration failed. Please try again.');
        },
      });
    }
  }
  
}
