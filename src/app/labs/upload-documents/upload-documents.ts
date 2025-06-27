import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-upload-documents',
  imports: [
    FormsModule
  ],
  templateUrl: './upload-documents.html',
  standalone: true,
  styleUrl: './upload-documents.css'
})
export class UploadDocuments implements OnInit {
  labId: string | null = null;
  selectedFile: File | null = null;
  uploadedFiles: any[] = [];
  baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.labId = sessionStorage.getItem('lab_id');
    if (this.labId) {
      this.loadUploadedFiles();
    }
  }

  loadUploadedFiles(): void {
    this.http.get<any[]>(`${this.baseUrl}/api/v1/laboratories-files/${this.labId}/files/list/`)
      .subscribe({
        next: (files) => {
          this.uploadedFiles = files;
          console.log('✅ Archivos encontrados:', files);
        },
        error: (err) => {
          console.error('❌ Error al cargar archivos:', err);
          alert('Error al cargar archivos del laboratorio.');
        }
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file || null;
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      alert('Debes seleccionar un archivo.');
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
          alert('Archivo subido correctamente!');
          this.selectedFile = null;
          this.loadUploadedFiles(); // Recargar la lista
        },
        error: (err) => {
          console.error('❌ Error al subir archivo:', err);
          alert('Error al subir archivo.');
        }
      });
  }

  downloadFile(filePath: string): void {
    const fullUrl = `${this.baseUrl}${filePath}`;
    window.open(fullUrl, '_blank');
  }

  deleteFile(fileId: number): void {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) {
      return;
    }

    this.http.delete<any>(
      `${this.baseUrl}/api/v1/laboratories-files/files/${fileId}/delete/`
    )
      .subscribe({
        next: (res) => {
          console.log('✅ Archivo eliminado:', res);
          alert('Archivo eliminado correctamente!');
          this.loadUploadedFiles();
        },
        error: (err) => {
          console.error('❌ Error al eliminar archivo:', err);
          alert('Error al eliminar archivo.');
        }
      });
  }
}
