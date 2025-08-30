import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoCompleto } from '../../model';
import { Jaula } from '../../../jaulas/model';
import { Service } from '../../service';

@Component({
  selector: 'app-execute-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class Modal {
  @Input() turno!: TurnoCompleto;
  @Output() cerrar = new EventEmitter<void>();
  @Output() completado = new EventEmitter<void>();

  jaulasDisponibles: Jaula[] = [];
  jaulaSeleccionada: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(private service: Service) {}

  ngOnInit(): void {
    this.cargarJaulasDisponibles();
  }

  cargarJaulasDisponibles(): void {
    this.service.getJaulasDisponibles().subscribe({
      next: (jaulas) => {
        this.jaulasDisponibles = jaulas;
        if (jaulas.length > 0) {
          this.jaulaSeleccionada = jaulas[0].id!;
        }
      },
      error: (error) => {
        console.error('Error loading jaulas:', error);
        this.errorMessage = 'Error al cargar jaulas disponibles';
      }
    });
  }

  obtenerEstado(): string {
    if (this.turno.horaFinRecepcion) return 'completado';
    if (this.turno.horaInicioRecepcion) return 'en recepción';
    return 'pendiente';
  }

  puedeIniciar(): boolean {
    return this.obtenerEstado() === 'pendiente';
  }

  puedeFinalizar(): boolean {
    return this.obtenerEstado() === 'en recepción';
  }

  confirmar(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const horaActual = new Date().toTimeString().substring(0, 5);

    if (this.puedeIniciar()) {
      this.verificarEstadoJaulaYIniciar(horaActual);
    } else if (this.puedeFinalizar()) {
      this.finalizarRecepcion(horaActual);
    }
  }

  // NUEVO MÉTODO: Verificar el estado actual de la jaula
  verificarEstadoJaulaYIniciar(horaActual: string): void {
    if (!this.jaulaSeleccionada) {
      this.errorMessage = 'Seleccione una jaula';
      this.isLoading = false;
      return;
    }

    // Verificar el estado ACTUAL de la jaula seleccionada
    this.service.verificarEstadoJaula(this.jaulaSeleccionada).subscribe({
      next: (jaula) => {
        if (jaula.enUso === 'S') {
          this.errorMessage = 'La jaula seleccionada ya está en uso. Por favor elija otra jaula.';
          this.cargarJaulasDisponibles(); // Recargar lista actualizada
          this.isLoading = false;
          return;
        }

        // Si la jaula está disponible (enUso: 'N'), iniciar recepción
        this.iniciarRecepcion(horaActual);
      },
      error: (error) => {
        console.error('Error verificando estado de jaula:', error);
        this.errorMessage = 'Error al verificar el estado de la jaula';
        this.isLoading = false;
      }
    });
  }

  iniciarRecepcion(horaActual: string): void {
    this.service.iniciarRecepcion(this.turno.id!, this.jaulaSeleccionada, horaActual).subscribe({
      next: () => {
        this.completado.emit();
        this.cerrar.emit();
      },
      error: (error) => {
        console.error('Error iniciando recepción:', error);
        this.errorMessage = 'Error al iniciar la recepción';
        this.isLoading = false;
      }
    });
  }

  finalizarRecepcion(horaActual: string): void {
    this.service.finalizarRecepcion(this.turno.id!, horaActual).subscribe({
      next: () => {
        this.completado.emit();
        this.cerrar.emit();
      },
      error: (error) => {
        console.error('Error finalizando recepción:', error);
        this.errorMessage = 'Error al finalizar la recepción';
        this.isLoading = false;
      }
    });
  }

  cancelar(): void {
    this.cerrar.emit();
  }
}