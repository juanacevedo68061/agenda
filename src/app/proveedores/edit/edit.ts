import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../service';
import { Proveedor } from '../model';

@Component({
  selector: 'app-proveedor-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class Edit implements OnInit {
  proveedor: Proveedor = { nombre: '' };
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
      this.errorMessage = 'ID de proveedor no válido';
      this.isLoading = false;
    }
  }

  load(id: string): void {
    this.Service.getById(id).subscribe({
      next: (proveedor) => {
        if (proveedor) {
          this.proveedor = { ...proveedor };
        } else {
          this.errorMessage = 'Proveedor no encontrado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading proveedor:', error);
        this.errorMessage = 'Error al cargar el proveedor';
        this.isLoading = false;
      }
    });
  }
  onSubmit(): void {
    if (!this.proveedor.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    if (!this.proveedor.id) {
      this.errorMessage = 'ID de proveedor no válido';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.Service.update(this.proveedor.id, this.proveedor).subscribe({
      next: () => {
        this.router.navigate(['/proveedores']);
      },
      error: (error) => {
        console.error('Error updating proveedor:', error);
        this.errorMessage = 'Error al actualizar el proveedor';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/proveedores']);
  }
}