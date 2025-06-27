import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-lab',
  imports: [
    FormsModule
  ],
  templateUrl: './register-lab.html',
  standalone: true,
  styleUrl: './register-lab.css'
})
export class RegisterLab implements OnInit {
  baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';

  lab = {
    business_name: '',
    nombre_comercial: '',
    ruc: '',
    address: '',
    email: '',
    phone: '',
    status: 'new',
    representante_legal: '',
    dni_representante: '',
    tipo_productos: '',
    mercado_objetivo: '',
    user: null
  };

  formVisible = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.checkIfLabExists();
  }

  checkIfLabExists(): void {
    this.http.get<any>(`${this.baseUrl}/api/v1/laboratories/me/`)
      .subscribe({
        next: (res) => {
          console.log('✅ Laboratorio ya existe:', res);

          // Guardar lab_id en sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('lab_id', res.id.toString());
          }

          // Redirigir a la vista de trazabilidad
          this.router.navigate(['/trace-product']);
        },
        error: (err) => {
          console.log('ℹ️ No existe laboratorio aún. Permitir registro.', err);
          this.formVisible = true;
        }
      });
  }

  onSubmit(): void {
    const userId = typeof window !== 'undefined'
      ? sessionStorage.getItem('user_id')
      : null;

    if (userId) {
      // @ts-ignore
      this.lab.user = parseInt(userId, 10);
    }

    this.http.post<any>(`${this.baseUrl}/api/v1/laboratories/`, this.lab)
      .subscribe({
        next: (res) => {
          console.log('✅ Laboratorio registrado:', res);

          if (typeof window !== 'undefined') {
            sessionStorage.setItem('lab_id', res.id.toString());
          }

          alert('Laboratorio registrado correctamente.');
          this.router.navigate(['/trace-product']);
        },
        error: (err) => {
          console.error('❌ Error al registrar laboratorio:', err);
          alert('Error al registrar laboratorio.');
        }
      });
  }
}
