import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserService } from '../../services/user/user.service';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  selectedUser: User | null = null;

  constructor(private userService: UserService, private fb: FormBuilder, private readonly toastr: ToastrService) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.userForm.setValue({
      username: user.name,
      email: user.email,
      password: '',
    });
    const modal = new bootstrap.Modal(document.getElementById('editUserModal')!);
    modal.show();
  }

  saveUser(): void {
    if (this.selectedUser) {
      const payload = {
        username: this.userForm.value.username,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
      };

      this.userService.updateUser(this.selectedUser.id, payload).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    }
  }

  deleteUser(userId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
    this.toastr.error('El usuario ha sido eliminado', 'Administrador')
  }

  closeModal(): void {
    const modalElement = document.getElementById('editUserModal');
    const modal = bootstrap.Modal.getInstance(modalElement!)!;
    modal.hide();
    this.toastr.success('Usuario actualizado', 'Administrador')
  }
}
