import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-upload-documents',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './upload-documents.html',
  styleUrl: './upload-documents.css'
})
export class UploadDocuments implements OnInit {
  labId: string | null = null;
  selectedFile: File | null = null;
  uploadedFiles: any[] = [];
  uploadError: string | null = null;
  baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.labId = sessionStorage.getItem('lab_id');
      if (this.labId) {
        this.loadUploadedFiles();
      }
    }
  }

  loadUploadedFiles(): void {
    this.uploadError = null;

    this.http.get<any[]>(`${this.baseUrl}/api/v1/laboratories-files/${this.labId}/files/list/`)
      .subscribe({
        next: (files) => {
          this.uploadedFiles = files;
          console.log('✅ Archivos encontrados:', files);
        },
        error: (err) => {
          console.error('❌ Error al cargar archivos:', err);
          this.uploadError = 'Error al cargar archivos del laboratorio.';
        }
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file || null;
  }

  onSubmit(): void {
    this.uploadError = null;

    if (!this.selectedFile) {
      this.uploadError = 'Debes seleccionar un archivo antes de subir.';
      return;
    }

    const formData = new FormData();
    formData.append('files', this.selectedFile);

    this.http.post<any>(
      `${this.baseUrl}/api/v1/laboratories-files/${this.labId}/files/`,
      formData
    )
      .subscribe({
        next: (res) => {
          console.log('✅ Archivo subido:', res);
          this.selectedFile = null;
          this.loadUploadedFiles();
        },
        error: (err) => {
          console.error('❌ Error al subir archivo:', err);
          this.uploadError = 'Error al subir archivo. Intenta nuevamente.';
        }
      });
  }

  downloadFile(filePath: string): void {
    const fullUrl = `${this.baseUrl}${filePath}`;
    window.open(fullUrl, '_blank');
  }

  deleteFile(fileId: number): void {
    this.uploadError = null;

    if (!confirm('¿Estás seguro de eliminar este archivo?')) {
      return;
    }

    this.http.delete<any>(
      `${this.baseUrl}/api/v1/laboratories-files/files/${fileId}/delete/`
    )
      .subscribe({
        next: (res) => {
          console.log('✅ Archivo eliminado:', res);
          this.loadUploadedFiles();
        },
        error: (err) => {
          console.error('❌ Error al eliminar archivo:', err);
          this.uploadError = 'Error al eliminar archivo. Intenta nuevamente.';
        }
      });
  }
}
