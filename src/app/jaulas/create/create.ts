import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Jaula } from '../model';

@Component({
  selector: 'app-jaula-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create {
  jaula: Omit<Jaula, 'enUso'> = { nombre: '' };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private Service: Service,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.jaula.nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.Service.create(this.jaula).subscribe({
      next: () => {
        this.router.navigate(['/jaulas']);
      },
      error: (error) => {
        console.error('Error creating jaula:', error);
        this.errorMessage = 'Error al crear la jaula';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/jaulas']);
  }
}