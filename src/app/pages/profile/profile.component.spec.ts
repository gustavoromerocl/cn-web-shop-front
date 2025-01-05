import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { updateUser } from '../../store/session/session.reducer';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    // Simula el usuario obtenido del store
    storeMock.select.and.returnValue(
      of({ id: '123', name: 'Test User', email: 'test@example.com' })
    );

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data from the store', () => {
    expect(component.profileForm.value).toEqual({
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  it('should dispatch updateUser and show success alert on form submit', () => {
    spyOn(window, 'alert');

    // Actualiza el valor del formulario
    component.profileForm.setValue({
      name: 'Updated User',
      email: 'updated@example.com',
    });

    component.onSubmit();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
      updateUser({
        user: { name: 'Updated User', email: 'updated@example.com' },
      })
    );

    expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!');
  });

  it('should not dispatch updateUser if the form is invalid', () => {
    // Establece un valor inválido en el formulario
    component.profileForm.setValue({
      name: '',
      email: 'invalid-email',
    });

    component.onSubmit();

    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });
});
