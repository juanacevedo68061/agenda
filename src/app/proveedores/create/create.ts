import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Proveedor } from '../model';

@Component({
  selector: 'app-proveedor-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create {
  proveedor: Proveedor = { nombre: '' };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private Service: Service,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.proveedor.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.Service.create(this.proveedor).subscribe({
      next: () => {
        this.router.navigate(['/proveedores']);
      },
      error: (error) => {
        console.error('Error creating proveedor:', error);
        this.errorMessage = 'Error al crear el proveedor';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/proveedores']);
  }
}