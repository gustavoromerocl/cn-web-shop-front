import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectUser } from '../store/session/session.selectors';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(route: import("@angular/router").ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRole = route.data['role'];

    return this.store.select(selectUser).pipe(
      map((user) => {
        console.log('Usuario actual:', user);
        console.log('Rol requerido:', requiredRole);
    
        if (user && user.role === requiredRole) {
          console.log('Acceso permitido');
          return true;
        }
    
        console.log('Acceso denegado');
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}
