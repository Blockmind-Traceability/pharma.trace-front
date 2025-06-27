import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-manage-product-units',
  imports: [
    FormsModule
  ],
  templateUrl: './manage-product-units.html',
  standalone: true,
  styleUrl: './manage-product-units.css'
})
export class ManageProductUnits implements OnInit {
  baseUrl = 'https://pharma-traceability-backend-production.up.railway.app';
  products: any[] = [];
  loading = false;

  selectedProduct: any = null;
  seriesList: string[] = [];

  unitData = {
    product: null,
    serial_number: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.http.get<any[]>(`${this.baseUrl}/api/v1/laboratories/me/products/`)
      .subscribe({
        next: (res) => {
          this.products = res;
          console.log('✅ Productos del laboratorio:', res);
          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error al cargar productos:', err);
          if (typeof window !== 'undefined') {
            alert('Error al cargar los productos.');
          } else {
            console.log('Error al cargar los productos.');
          }
          this.loading = false;
        }
      });
  }

  onProductClick(product: any): void {
    this.selectedProduct = product;
    this.loadSeriesForProduct(product.id);
  }

  loadSeriesForProduct(productId: number): void {
    this.seriesList = []; // limpiar antes de cargar nuevas
    this.http.get<any>(`${this.baseUrl}/api/v1/products/${productId}/unit-series/`)
      .subscribe({
        next: (res) => {
          this.seriesList = res.series;
          console.log(`✅ Series del producto ${productId}:`, res.series);
        },
        error: (err) => {
          console.error(`❌ Error al obtener series del producto ${productId}:`, err);
          if (typeof window !== 'undefined') {
            alert('Error al cargar las series del producto.');
          } else {
            console.log('Error al cargar las series del producto.');
          }
        }
      });
  }

  onSubmit(): void {
    if (!this.unitData.product || !this.unitData.serial_number) {
      if (typeof window !== 'undefined') {
        alert('Debe completar todos los campos.');
      } else {
        console.log('Debe completar todos los campos.');
      }
      return;
    }

    this.http.post<any>(
      `${this.baseUrl}/api/v1/products/product-units/create/`,
      this.unitData
    )
      .subscribe({
        next: (res) => {
          console.log('✅ Unidad registrada:', res);
          if (typeof window !== 'undefined') {
            alert('Unidad registrada correctamente.');
          }
          this.unitData.serial_number = '';
          this.unitData.product = null;

          // Si estamos viendo ese producto, recargar series
          if (this.selectedProduct?.id === res.product) {
            this.loadSeriesForProduct(res.product);
          }
        },
        error: (err) => {
          console.error('❌ Error al registrar unidad:', err);
          if (typeof window !== 'undefined') {
            alert('Error al registrar la unidad.');
          } else {
            console.log('Error al registrar la unidad.');
          }
        }
      });
  }
}
