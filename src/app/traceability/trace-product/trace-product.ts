import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-trace-product',
  imports: [
    FormsModule
  ],
  templateUrl: './trace-product.html',
  standalone: true,
  styleUrl: './trace-product.css'
})
export class TraceProduct {

  baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';

  serialInput = '';
  traceData: any[] = [];
  loading = false;
  notFound = false;

  constructor(private http: HttpClient) {}

  onSearch(): void {
    this.traceData = [];
    this.notFound = false;

    if (!this.serialInput) {
      if (typeof window !== 'undefined') {
        alert('Ingrese una serie.');
      }
      return;
    }

    this.loading = true;

    this.http.get<any>(`${this.baseUrl}/api/v1/products/traceability/${this.serialInput}/`)
      .subscribe({
        next: (res) => {
          console.log('✅ Trazabilidad obtenida:', res);
          this.traceData = res.trace;
          this.loading = false;

          if (this.traceData.length === 0) {
            this.notFound = true;
          }
        },
        error: (err) => {
          console.error('❌ Error al obtener trazabilidad:', err);
          this.loading = false;
          this.notFound = true;
        }
      });
  }
}
