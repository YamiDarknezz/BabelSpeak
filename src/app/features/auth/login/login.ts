import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  email = '';
  password = '';
  loading = false;
  message = '';
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    try {
      const user = await this.auth.getUser();
      if (user) {
        console.log('🔄 Sesión detectada, redirigiendo al dashboard...');
        await this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.warn('No hay sesión activa');
    }
  }

  async onLogin() {
    this.loading = true;
    this.errorMsg = '';
    this.message = '';

    try {
      const { user, message } = await this.auth.loginUser(
        this.email,
        this.password
      );
      this.message = message;
      //console.log('Sesión activa:', user); Debug

      // Redirigir al dashboard después del login exitoso
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMsg = error.message || 'Error al iniciar sesión';
      console.error('Error en login:', error);
    } finally {
      this.loading = false;
    }
  }
}
