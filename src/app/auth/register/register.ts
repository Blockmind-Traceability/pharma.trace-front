import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerData = {
    username: '',
    email: '',
    password: '',
    role: ''
  };

  registerError: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    this.registerError = null; // Limpiar errores previos

    this.http.post<any>(
      'https://pharma-traceability-backend-production.up.railway.app/api/v1/auth/register',
      this.registerData
    ).subscribe({
      next: (res) => {
        console.log('✅ Registro exitoso:', res);
        // Redirigir al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
        if (err.status === 400) {
          this.registerError = 'Datos inválidos o incompletos. Verifica la información ingresada.';
        } else {
          this.registerError = 'Ocurrió un error al registrar. Intenta nuevamente más tarde.';
        }
      }
    });
  }
}
