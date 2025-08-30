import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Turno, DetalleTurno } from '../model';
import { Proveedor } from '../../proveedores/model';
import { Producto } from '../../productos/model';

@Component({
  selector: 'app-turno-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  turno: Omit<Turno, 'id' | 'idJaula' | 'horaInicioRecepcion' | 'horaFinRecepcion'> = {
    fecha: '',
    horaInicioAgendamiento: '',
    horaFinAgendamiento: '',
    idProveedor: '',
    detalles: []
  };
  
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = []; // ← Productos disponibles para seleccionar
  opcionesHoras: string[] = [];
  isSubmitting = false;
  errorMessage = '';
  
  nuevoDetalle: Omit<DetalleTurno, 'id' | 'idTurno'> = {
    idProducto: '',
    cantidad: 0
  };

  constructor(
    private Service: Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
    this.opcionesHoras = this.Service.generarOpcionesHoras();
  }

  load(): void {
    this.Service.getProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: (error) => console.error('Error loading proveedores:', error)
    });

    this.Service.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.actualizarProductosFiltrados(); // ← Inicializar productos filtrados
      },
      error: (error) => console.error('Error loading productos:', error)
    });
  }

  // Actualizar lista de productos disponibles (excluyendo los ya agregados)
  actualizarProductosFiltrados(): void {
    this.productosFiltrados = this.productos.filter(producto => 
      !this.turno.detalles.some(detalle => detalle.idProducto === producto.id)
    );
    
    // Si el producto seleccionado ya no está disponible, resetearlo
    if (this.nuevoDetalle.idProducto && 
        !this.productosFiltrados.some(p => p.id === this.nuevoDetalle.idProducto)) {
      this.nuevoDetalle.idProducto = '';
    }
  }

  agregarDetalle(): void {
    if (!this.nuevoDetalle.idProducto || this.nuevoDetalle.cantidad <= 0) {
      this.errorMessage = 'Seleccione un producto y ingrese una cantidad válida';
      return;
    }

    this.turno.detalles.push({...this.nuevoDetalle});
    this.nuevoDetalle = { idProducto: '', cantidad: 0 };
    this.actualizarProductosFiltrados(); // ← Actualizar después de agregar
  }

  eliminarDetalle(index: number): void {
    this.turno.detalles.splice(index, 1);
    this.actualizarProductosFiltrados(); // ← Actualizar después de eliminar
  }

  obtenerNombreProducto(idProducto: string): string {
    const producto = this.productos.find(p => p.id === idProducto);
    return producto ? producto.nombre : 'Producto no encontrado';
  }

  validarHoras(): boolean {
    if (!this.turno.horaInicioAgendamiento || !this.turno.horaFinAgendamiento) {
      return true;
    }
    
    const inicio = this.turno.horaInicioAgendamiento;
    const fin = this.turno.horaFinAgendamiento;
    
    return inicio < fin;
  }

  onSubmit(): void {
    // Validar fecha
    if (!this.turno.fecha) {
      this.errorMessage = 'La fecha es requerida';
      return;
    }

    // Validar horas
    if (!this.turno.horaInicioAgendamiento || !this.turno.horaFinAgendamiento) {
      this.errorMessage = 'Las horas de agendamiento son requeridas';
      return;
    }

    // Validar que hora inicio sea menor que hora fin
    if (!this.validarHoras()) {
      this.errorMessage = 'La hora de inicio debe ser menor que la hora de fin';
      return;
    }

    // Validar proveedor
    if (!this.turno.idProveedor) {
      this.errorMessage = 'El proveedor es requerido';
      return;
    }

    // Validar productos
    if (this.turno.detalles.length === 0) {
      this.errorMessage = 'Debe agregar al menos un producto';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.Service.create(this.turno as Turno).subscribe({
      next: () => {
        this.router.navigate(['/turnos']);
      },
      error: (error) => {
        console.error('Error creating turno:', error);
        this.errorMessage = 'Error al registrar el turno';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/turnos']);
  }
}