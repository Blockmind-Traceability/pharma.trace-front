import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register-event',
  imports: [
    FormsModule
  ],
  templateUrl: './register-event.html',
  standalone: true,
  styleUrl: './register-event.css'
})
export class RegisterEvent {

  //baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';
  //baseUrl = 'http://127.0.0.1:8000';
  baseUrl = 'https://pharma-trace-backend-bcgsb5ahg6grgcfs.canadacentral-01.azurewebsites.net';

  eventData = {
    productSerial: '',
    batchId: '',
    eventType: '',
    destination: '',
    notes: '',
    deviceInfo: '',
    geolocation: {
      ip: '',
      lat: null,
      lng: null
    },
    responsible: {
      name: '',
      role: '',
      documentId: ''
    }
  };

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    console.log('🔹 Enviando payload:', this.eventData);

    this.http.post<any>(`${this.baseUrl}/api/v1/products/blockchain/events`, this.eventData)
      .subscribe({
        next: (res) => {
          console.log('✅ Evento registrado:', res);
          if (typeof window !== 'undefined') {
            alert('Evento registrado exitosamente en blockchain.');
          }
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Error al registrar evento:', err);
          if (typeof window !== 'undefined') {
            alert('Error al registrar el evento.');
          }
        }
      });
  }

  resetForm(): void {
    this.eventData = {
      productSerial: '',
      batchId: '',
      eventType: '',
      destination: '',
      notes: '',
      deviceInfo: '',
      geolocation: {
        ip: '',
        lat: null,
        lng: null
      },
      responsible: {
        name: '',
        role: '',
        documentId: ''
      }
    };
  }
}
