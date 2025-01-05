import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { selectUser } from '../../store/session/session.selectors';
import { logout } from '../../store/session/session.reducer';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class BaseLayoutComponent {
  user$: Observable<{ id: string; name?: string; role: string; email: string } | null>;

  constructor(private store: Store, private router: Router) {
    this.user$ = this.store.select(selectUser);
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']); // Redirige al login después del logout
  }
}
