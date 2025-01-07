import { Injectable } from '@angular/core';
import { PublicClientApplication, Configuration, InteractionType, InteractionRequiredAuthError } from '@azure/msal-browser';
import { Store } from '@ngrx/store';
import { login } from '../../store/session/session.reducer';

@Injectable({ providedIn: 'root' })
export class MsalService {
  private msalInstance: PublicClientApplication;

  constructor(private store: Store) {
    const config: Configuration = {
      auth: {
        clientId: '858b4bc0-7115-4192-a217-5de9275c3ab1', // Reemplaza con el ID de tu aplicación registrada en Azure AD.
        authority: 'https://login.microsoftonline.com/6594e534-4a19-4085-a8e1-411ef99af367', // Reemplaza con tu tenant ID.
        redirectUri: window.location.origin
      }
    };

    // Call initialize here
    this.msalInstance = new PublicClientApplication(config);
    this.msalInstance.initialize().catch(error => {
        console.error("Error initializing MSAL instance:", error);
    });
  }

  login() {
    this.msalInstance.loginPopup({
      scopes: ['user.read'], // Solicita los permisos necesarios
      prompt: 'select_account' // Fuerza al usuario a seleccionar una cuenta
    })
    .then(response => {
      const { account, idToken } = response;
      localStorage.setItem('token', idToken);
      this.store.dispatch(login({ user: { 
        id: account.localAccountId, 
        name: account.name, 
        email: account.username, 
        role: 'ROLE_USER' //Establecer cuando se implemente en MS AD
      }}));
      return true;
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
      // Manejar el error de forma más específica
      if (error instanceof InteractionRequiredAuthError) {
        // El usuario debe interactuar (por ejemplo, iniciar sesión)
        console.log('El usuario debe iniciar sesión');
      }
    });
  }
}