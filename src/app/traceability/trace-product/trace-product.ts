import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  //baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';
  //baseUrl = 'http://127.0.0.1:8000';
  baseUrl = 'https://pharma-trace-backend-bcgsb5ahg6grgcfs.canadacentral-01.azurewebsites.net';

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

          let processedTrace = res.trace || [];

          // --- INICIO DE LA MEJORA ---
          // Procesamos los datos para reemplazar "Origen desconocido"
          if (processedTrace.length > 1) {
            for (let i = 1; i < processedTrace.length; i++) {
              const currentEvent = processedTrace[i];
              const previousEvent = processedTrace[i - 1];

              // Si el origen actual es desconocido, usa el destino anterior
              if (currentEvent.origin === 'Origen desconocido' && previousEvent.destination) {
                currentEvent.origin = previousEvent.destination;
              }
            }
          }
          // --- FIN DE LA MEJORA ---

          this.traceData = processedTrace;
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
