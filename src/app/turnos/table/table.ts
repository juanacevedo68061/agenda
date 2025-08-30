import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Turno, TurnoCompleto, DetalleTurnoCompleto } from '../model';
import { Modal as ExecuteModal } from './execute/modal';
import { Modal as DetailModal } from './detail/modal';
import { Header } from '../../header/header';

@Component({
  selector: 'app-turnos-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ExecuteModal,
    DetailModal,
    Header
  ],
  templateUrl: './table.html',
  styleUrls: ['./table.css']
})
export class Table implements OnInit {
  // Datos principales
  turnos: TurnoCompleto[] = [];
  turnosRaw: Turno[] = [];
  fechaSeleccionada: string = '';
  
  // Estados de UI
  isLoading = false;
  errorMessage = '';
  
  // Para modales
  turnoSeleccionado?: TurnoCompleto;
  mostrarModalEjecucion = false;
  mostrarModalDetalles = false;

  constructor(
    private Service: Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];
    this.cargarTurnos();
  }

  // --- Carga de datos ---
  cargarTurnos(): void {
    if (!this.fechaSeleccionada) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.Service.getTurnosPorFecha(this.fechaSeleccionada).subscribe({
      next: (turnos) => {
        this.turnosRaw = turnos;
        this.cargarTurnosCompletos();
      },
      error: (error) => {
        console.error('Error loading turnos:', error);
        this.errorMessage = 'Error al cargar los turnos';
        this.isLoading = false;
      }
    });
  }

  cargarTurnosCompletos(): void {
    this.turnos = [];
    
    this.Service.getProveedores().subscribe(proveedores => {
      this.Service.getProductos().subscribe(productos => {
        this.Service.getTodasLasJaulas().subscribe(jaulas => { // ← ¡Cargar TODAS las jaulas!
          
          this.turnosRaw.forEach(turno => {
            const proveedor = proveedores.find(p => p.id === turno.idProveedor);
            const jaula = jaulas.find(j => j.id === turno.idJaula); // ← Buscar jaula asignada
            
            if (proveedor) {
              const detallesCompletos: DetalleTurnoCompleto[] = turno.detalles.map(detalle => {
                const producto = productos.find(p => p.id === detalle.idProducto);
                return {
                  id: detalle.id,
                  idTurno: detalle.idTurno,
                  cantidad: detalle.cantidad,
                  producto: producto || { id: detalle.idProducto, nombre: 'Producto no encontrado' }
                };
              });

              const turnoCompleto: TurnoCompleto = {
                id: turno.id,
                fecha: turno.fecha,
                horaInicioAgendamiento: turno.horaInicioAgendamiento,
                horaFinAgendamiento: turno.horaFinAgendamiento,
                horaInicioRecepcion: turno.horaInicioRecepcion,
                horaFinRecepcion: turno.horaFinRecepcion,
                proveedor: proveedor,
                jaula: jaula, // ← Asignar jaula encontrada
                detalles: detallesCompletos
              };

              this.turnos.push(turnoCompleto);
            }
          });

          this.turnos.sort((a, b) => 
            a.horaInicioAgendamiento.localeCompare(b.horaInicioAgendamiento)
          );
          
          this.isLoading = false;
        });
      });
    });
  }

  // --- Lógica de estado ---
  obtenerEstado(turno: TurnoCompleto): string {
    if (turno.horaFinRecepcion) return 'completado';
    if (turno.horaInicioRecepcion) return 'en recepción';
    return 'pendiente';
  }

  puedeIniciar(turno: TurnoCompleto): boolean {
    return this.obtenerEstado(turno) === 'pendiente';
  }

  puedeFinalizar(turno: TurnoCompleto): boolean {
    return this.obtenerEstado(turno) === 'en recepción';
  }

  // --- Manejo de modales ---
  abrirModalEjecucion(turno: TurnoCompleto): void {
    this.turnoSeleccionado = turno;
    this.mostrarModalEjecucion = true;
  }

  cerrarModalEjecucion(): void {
    this.mostrarModalEjecucion = false;
    this.turnoSeleccionado = undefined;
  }

  abrirModalDetalles(turno: TurnoCompleto): void {
    this.turnoSeleccionado = turno;
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.turnoSeleccionado = undefined;
  }

  // --- Acciones ---
  onRecepcionCompletada(): void {
    this.cerrarModalEjecucion();
    this.cargarTurnos(); // Recargar datos después de la acción
  }

  registrarNuevo(): void {
    this.router.navigate(['/turnos/registrar']);
  }

  home(): void {
    this.router.navigate(['/']);
  }
}