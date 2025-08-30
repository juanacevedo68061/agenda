import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../service';
import { Jaula } from '../model';

@Component({
  selector: 'app-jaula-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class Edit implements OnInit {
  jaula: Jaula = { nombre: '', enUso: 'N' };
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
      this.errorMessage = 'ID de jaula no válido';
      this.isLoading = false;
    }
  }

  load(id: string): void {
    this.Service.getById(id).subscribe({
      next: (jaula) => {
        if (jaula) {
          this.jaula = { ...jaula };
        } else {
          this.errorMessage = 'Jaula no encontrada';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jaula:', error);
        this.errorMessage = 'Error al cargar la jaula';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.jaula.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    if (!this.jaula.id) {
      this.errorMessage = 'ID de jaula no válido';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.Service.update(this.jaula.id, this.jaula).subscribe({
      next: () => {
        this.router.navigate(['/jaulas']);
      },
      error: (error) => {
        console.error('Error updating jaula:', error);
        this.errorMessage = 'Error al actualizar la jaula';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/jaulas']);
  }
}