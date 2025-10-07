import { Injectable } from '@angular/core';
import { Account, ID, Models } from 'appwrite';
import { account } from '../appwrite.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private account: Account = account;

  /** Registrar nuevo usuario con teléfono */
  async register(email: string, password: string, name: string, phone: string) {
    try {
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      await this.account.updatePrefs({ phone });
      return user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /** Iniciar sesión o devolver sesión activa */
  async loginUser(email: string, password: string) {
    try {
      // 🔹 Verificar si ya hay sesión
      const current = await this.account.get();
      return {
        user: current,
        message: `Ya tienes una sesión activa como ${current.name}`,
      };
    } catch {
      // 🔹 Si no hay sesión activa, crear una nueva
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      const user = await this.account.get();
      return {
        user,
        message: `Bienvenido, ${user.name || 'usuario'}!`,
      };
    }
  }

  /** Cerrar sesión */
  async logout() {
    try {
      await this.account.deleteSession('current');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /** Obtener usuario actual */
  async getUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await this.account.get();
    } catch {
      return null;
    }
  }

  /** Manejo de errores Appwrite */
  private handleError(error: any): Error {
    if (error?.code === 401) {
      if (error?.message?.includes('Invalid credentials')) {
        return new Error('Correo o contraseña incorrectos.');
      }
      return new Error('No autorizado. Por favor, inicia sesión.');
    }
    if (error?.code === 404) return new Error('Usuario no encontrado.');
    if (error?.code === 409) return new Error('El correo ya está registrado.');
    if (error?.code === 500)
      return new Error('Error del servidor. Intenta más tarde.');

    return new Error(error?.message || 'Error desconocido.');
  }
}
