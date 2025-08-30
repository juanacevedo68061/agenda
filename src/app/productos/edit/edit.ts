import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../service';
import { Producto } from '../model';

@Component({
  selector: 'app-producto-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class Edit implements OnInit {
  producto: Producto = { nombre: '' };
  isSubmitting = false;
  errorMessage = '';
  isLoading = true;

  constructor(
    private Service: Service,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    } else {
      this.errorMessage = 'ID de producto no válido';
      this.isLoading = false;
    }
  }

  load(id: string): void {
    this.Service.getById(id).subscribe({
      next: (producto) => {
        if (producto) {
          this.producto = { ...producto };
        } else {
          this.errorMessage = 'Producto no encontrado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading producto:', error);
        this.errorMessage = 'Error al cargar el producto';
        this.isLoading = false;
      }
    });
  }
  onSubmit(): void {
    if (!this.producto.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    if (!this.producto.id) {
      this.errorMessage = 'ID de producto no válido';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.Service.update(this.producto.id, this.producto).subscribe({
      next: () => {
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        console.error('Error updating producto:', error);
        this.errorMessage = 'Error al actualizar el producto';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/productos']);
  }
}