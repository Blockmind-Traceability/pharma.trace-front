import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginData = {
    email: '',
    password: ''
  };

  loginError: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}

  onSubmit() {
    this.loginError = null;

    this.http.post<any>(
      'https://pharma-traceability-backend-production.up.railway.app/api/v1/auth/login',
      this.loginData
    ).subscribe({
      next: (res) => {
        console.log('✅ Login successful:', res);

        this.authService.login({
          access: res.access,
          refresh: res.refresh
        });

        this.http.get<any>(
          'https://pharma-traceability-backend-production.up.railway.app/api/v1/auth/me'
        ).subscribe({
          next: (user) => {
            console.log('✅ Usuario autenticado:', user);
            this.authService.login({
              ...res,
              ...user
            });
            this.router.navigate(['/register-lab']);
          },
          error: (err) => {
            console.error('❌ Error obteniendo datos de usuario:', err);
            this.loginError = 'Error al obtener datos de usuario.';
          }
        });
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        if (err.status === 401) {
          this.loginError = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else {
          this.loginError = 'Error al iniciar sesión. Intenta nuevamente más tarde.';
        }
      }
    });
  }
}
