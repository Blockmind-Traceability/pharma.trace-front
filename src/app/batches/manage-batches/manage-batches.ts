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
  baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';

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

  createBatch(): void {
    // Filtrar series vacías
    const filteredSeries = this.newBatch.series.filter(s => s.trim() !== '');

    if (!this.newBatch.origin || !this.newBatch.destination || filteredSeries.length === 0) {
      if (typeof window !== 'undefined') {
        alert('Completa todos los campos del lote.');
      }
      return;
    }

    const payload = {
      origin: this.newBatch.origin,
      destination: this.newBatch.destination,
      series: filteredSeries
    };

    this.http.post<any>(`${this.baseUrl}/api/v1/batches/`, payload)
      .subscribe({
        next: (res) => {
          console.log('✅ Lote creado:', res);
          if (typeof window !== 'undefined') {
            alert('Lote creado exitosamente.');
          }
          this.newBatch = {
            origin: '',
            destination: '',
            series: ['']
          };
          this.loadBatches();
        },
        error: (err) => {
          console.error('❌ Error al crear lote:', err);
          if (typeof window !== 'undefined') {
            alert('Error al crear el lote.');
          }
        }
      });
  }
}
