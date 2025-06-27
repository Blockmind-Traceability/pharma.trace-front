import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-alerts',
  imports: [],
  templateUrl: './view-alerts.html',
  standalone: true,
  styleUrl: './view-alerts.css'
})
export class ViewAlerts implements OnInit {
  baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';
  alerts: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // No cargamos nada inicialmente
  }

  loadAllAlerts(): void {
    this.loading = true;
    this.http.get<any>(`${this.baseUrl}/api/v1/products/alerts/`)
      .subscribe({
        next: (res) => {
          this.alerts = res.alerts;
          console.log('✅ Alertas globales:', res.alerts);
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error al cargar alertas:', err);
          if (typeof window !== 'undefined') {
            alert('Error al cargar las alertas.');
          }
          this.loading = false;
        }
      });
  }

  loadLabAlerts(): void {
    let labId: string | null = null;

    if (typeof window !== 'undefined') {
      labId = sessionStorage.getItem('lab_id');
    }

    if (!labId) {
      if (typeof window !== 'undefined') {
        alert('No se encontró el ID del laboratorio en sesión.');
      }
      return;
    }

    this.loading = true;
    this.http.get<any>(`${this.baseUrl}/api/v1/products/alerts/lab/${labId}/`)
      .subscribe({
        next: (res) => {
          this.alerts = res.alerts;
          console.log(`✅ Alertas del laboratorio ${labId}:`, res.alerts);
          this.loading = false;
        },
        error: (err) => {
          console.error(`❌ Error al cargar alertas del lab ${labId}:`, err);
          if (typeof window !== 'undefined') {
            alert('Error al cargar las alertas del laboratorio.');
          }
          this.loading = false;
        }
      });
  }
}
