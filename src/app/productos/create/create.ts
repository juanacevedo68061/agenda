import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Producto } from '../model';

@Component({
  selector: 'app-producto-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create {
  producto: Producto = { nombre: '' };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private Service: Service,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.producto.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.Service.create(this.producto).subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        console.error('Error creating producto:', error);
        this.errorMessage = 'Error al crear el producto';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/productos']);
  }
}