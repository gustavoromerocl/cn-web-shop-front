import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = []; // Almacenamiento temporal en memoria
  private readonly apiUrl = 'http://localhost:8081/api'; 

  constructor(private http: HttpClient) {}

 // Registrar un nuevo usuario
 registerUser(user: any): Observable<any> {
  const url = `${this.apiUrl}/auth/signup`;
  return this.http.post<User>(url, user, { observe: 'response' });
  }

  login(email: string, password: string) {
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post<any>(url, { email, password})
  }

  getProfile(): Observable<any> {
    const url = `${this.apiUrl}/users/profile`;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(url, { headers });
  }
  

  // Devuelve el usuario sin la contraseña
  findUser(email: string, password: string): Omit<User, 'password'> | null {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  // Obtener todos los usuarios (solo para verificar)
  getAllUsers(): User[] {
    return this.users;
  }
}
