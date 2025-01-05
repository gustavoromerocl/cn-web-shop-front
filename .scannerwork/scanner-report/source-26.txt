import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { selectUser } from '../../store/session/session.selectors';
import { updateUser } from '../../store/session/session.reducer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class ProfileComponent {
  profileForm: FormGroup;
  user$: Observable<{ id: string; name?: string; email: string } | null>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.user$ = this.store.select(selectUser);

    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.user$.subscribe((user) => {
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.store.dispatch(updateUser({ user: this.profileForm.value }));
      alert('Profile updated successfully!');
    }
  }
}
