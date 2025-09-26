import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-manage-batches',
  imports: [
    FormsModule
  ],
  templateUrl: './manage-batches.html',
  standalone: true,
  styleUrl: './manage-batches.css'
})
export class ManageBatches implements OnInit {
  //baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';
  //baseUrl = 'http://127.0.0.1:8000';
  baseUrl = 'https://pharma-trace-backend-bcgsb5ahg6grgcfs.canadacentral-01.azurewebsites.net';

  batches: any[] = [];
  selectedBatch: any = null;
  loading = false;

  newBatch = {
    origin: '',
    destination: '',
    series: [''] // por defecto un input vacío
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.loading = true;
    this.http.get<any[]>(`${this.baseUrl}/api/v1/batches/me/`)
      .subscribe({
        next: (res) => {
          this.batches = res;
          console.log('✅ Lotes cargados:', res);
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error al cargar lotes:', err);
          if (typeof window !== 'undefined') {
            alert('Error al cargar los lotes.');
          }
          this.loading = false;
        }
      });
  }

  selectBatch(batch: any): void {
    this.selectedBatch = null;

    this.http.get<any>(`${this.baseUrl}/api/v1/batches/${batch.id}/`)
      .subscribe({
        next: (res) => {
          this.selectedBatch = res;
          console.log(`✅ Detalles del lote ${batch.id}:`, res);
        },
        error: (err) => {
          console.error(`❌ Error al obtener lote ${batch.id}:`, err);
          if (typeof window !== 'undefined') {
            alert('Error al obtener el detalle del lote.');
          }
        }
      });
  }

  addSerieField(): void {
    this.newBatch.series.push('');
  }

  removeSerieField(index: number): void {
    this.newBatch.series.splice(index, 1);
  }


  submitting = false;

  createBatch(): void {
    if (this.submitting) return; // anti-doble click
    // Filtrar series vacías
    const filteredSeries = this.newBatch.series.map(s => s.trim()).filter(Boolean);

    if (!this.newBatch.origin.trim() || !this.newBatch.destination.trim() || filteredSeries.length === 0) {
      alert('Completa todos los campos del lote.');
      return;
    }

    const payload = {
      origin: this.newBatch.origin.trim(),
      destination: this.newBatch.destination.trim(),
      series: filteredSeries
    };

    this.submitting = true;

    this.http.post<any>(`${this.baseUrl}/api/v1/batches/`, payload, { observe: 'response' })
      .subscribe({
        next: (res) => {
          console.log('✅ Lote creado:', res.body ?? res);
          alert('Lote creado exitosamente.');
          // Limpia el formulario
          this.newBatch = { origin: '', destination: '', series: [''] };
          this.loadBatches();
          this.submitting = false;
        },
        error: (err) => {
          console.error('❌ Error al crear lote:', err);
          // Mostrar detalle si existe
          const msg = typeof err?.error === 'string'
            ? err.error
            : JSON.stringify(err?.error ?? {}, null, 2);
          alert(`Error al crear el lote (HTTP ${err.status}). Detalle:\n${msg}`);

          // A veces el servidor guarda y luego falla; verifica igual:
          this.loadBatches();
          this.submitting = false;
        }
      });
  }




}
