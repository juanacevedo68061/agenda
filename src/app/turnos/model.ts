import { Proveedor } from '../proveedores/model';
import { Producto } from '../productos/model';
import { Jaula } from '../jaulas/model';

export interface Turno {
  id?: string;
  fecha: string;
  horaInicioAgendamiento: string;
  horaFinAgendamiento: string;
  idProveedor: string;
  idJaula?: string;
  horaInicioRecepcion?: string;
  horaFinRecepcion?: string;
  detalles: DetalleTurno[];
}

export interface DetalleTurno {
  id?: string;
  idTurno?: string;
  idProducto: string;
  cantidad: number;
}

export interface TurnoCompleto extends Omit<Turno, 'idProveedor' | 'idJaula' | 'detalles'> {
  proveedor: Proveedor;
  jaula?: Jaula;
  detalles: DetalleTurnoCompleto[];
}

export interface DetalleTurnoCompleto extends Omit<DetalleTurno, 'idProducto'> {
  producto: Producto;
}
