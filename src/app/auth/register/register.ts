import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule
  ],
  templateUrl: './register.html',
  standalone: true,
  styleUrl: './register.css'
})
export class Register {
  registerData = {
    username: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private http: HttpClient,
              private router: Router) {}

  onSubmit() {
    this.http.post('https://pharma-traceability-backend-production.up.railway.app/api/v1/auth/register', this.registerData)
      .subscribe({
        next: (res) => {
          console.log('✅ Registro exitoso:', res);
          // Redirige al login o dashboard
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error('❌ Error en registro:', err);
        }
      });
  }
}
