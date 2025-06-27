import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../service/auth';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  standalone: true,
  styleUrl: './login.css'
})
export class Login {

  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}

  onSubmit() {
    this.http.post<any>('https://pharma-traceability-backend-production.up.railway.app/api/v1/auth/login', this.loginData)
      .subscribe({
        next: (res) => {
          console.log('✅ Login successful:', res);

          // Guardar tokens y datos en el AuthService
          this.authService.login({
            access: res.access,
            refresh: res.refresh
          });

          // Luego, GET /auth/me
          this.http.get<any>('https://pharma-traceability-backend-production.up.railway.app/api/v1/auth/me')
            .subscribe({
              next: (user) => {
                console.log('✅ Usuario autenticado:', user);
                this.authService.login({
                  ...res,
                  ...user
                });
                this.router.navigate(['/register-lab']);
              }
            });
        },
        error: (err) => {
          console.error('❌ Login error:', err);
          alert('Credenciales incorrectas.');
        }
      });
  }

}
