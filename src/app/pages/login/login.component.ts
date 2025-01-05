import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services//user/user.service';
import { CommonModule } from '@angular/common';
import { login } from '../../store/session/session.reducer';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private userService: UserService,
    private router: Router,
    private readonly toastr: ToastrService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToRecoverPassword() {
    this.router.navigate(['recover-password'])
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login Response:', response);
          localStorage.setItem('token', response.token); // Guarda el token
  
          // Llama a getProfile
          this.userService.getProfile().subscribe({
            next: (user) => {
              console.log('User Profile:', user);
              this.store.dispatch(login({ user: { 
                id: user.id, 
                name: user.username, 
                email: user.email, 
                role: user.roles[0].name || 'ROLE_USER' 
              }}));

              this.router.navigate(['/home']);
            },
            error: (err) => {
              console.error('Error fetching profile:', err);
              this.toastr.error('Failed to fetch profile. Please try again.');
            },
          });
        },
        error: (err) => {
          console.error('Error Details:', err);
          this.toastr.error('Login failed. Please try again.');
        },
      });
      // Encuentra al usuario con el servicio
      const user = this.userService.findUser(email, password);
  
      // if (user) {
      //   // Asegúrate de que todos los campos necesarios estén definidos
      //   this.store.dispatch(login({ user: { ...user, role: user.role || 'ROLE_USER' } }));
      //   this.router.navigate(['/home']); // Redirige a home
      // } else {
      //   alert('Invalid email or password.');
      // }
    }
  }
  
}
