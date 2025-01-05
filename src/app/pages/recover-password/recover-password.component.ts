import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private readonly toastr: ToastrService) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.recoverForm.valid) {
      const { email } = this.recoverForm.value;
      this.toastr.info(`Password recovery instructions have been sent to: ${email}`);
      this.router.navigate(['/login']); // Redirige al login
    }
  }
}
