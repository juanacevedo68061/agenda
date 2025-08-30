import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Turno, DetalleTurno } from './model';
import { Proveedor } from '../proveedores/model';
import { Producto } from '../productos/model';
import { Jaula } from '../jaulas/model';

@Injectable({
  providedIn: 'root'
})
export class Service {
  private apiUrl = 'http://localhost:3000/turnos';
  private jaulasUrl = 'http://localhost:3000/jaulas';

  constructor(private http: HttpClient) {}

  // Método para registro de turnos (Módulo 4)
  create(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.apiUrl, turno);
  }

  // Métodos para datos relacionados (Módulo 4)
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>('http://localhost:3000/proveedores');
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>('http://localhost:3000/productos');
  }

  // Métodos para jaulas
  getJaulasDisponibles(): Observable<Jaula[]> {
    return this.http.get<Jaula[]>(`${this.jaulasUrl}?enUso=N`);
  }

  getTodasLasJaulas(): Observable<Jaula[]> {
    return this.http.get<Jaula[]>(this.jaulasUrl);
  }

  // Método para verificar el estado de una jaula específica
  verificarEstadoJaula(idJaula: string): Observable<Jaula> {
    return this.http.get<Jaula>(`${this.jaulasUrl}/${idJaula}`);
  }

  // Métodos para ejecución de recepción (Módulo 5) - CORREGIDOS
  iniciarRecepcion(idTurno: string, idJaula: string, horaInicio: string): Observable<any> {
    // Primero actualizar la jaula a "en uso" (S)
    return this.http.patch(`${this.jaulasUrl}/${idJaula}`, {
      enUso: 'S'
    }).pipe(
      // Luego actualizar el turno
      switchMap(() => this.http.patch<Turno>(`${this.apiUrl}/${idTurno}`, {
        idJaula,
        horaInicioRecepcion: horaInicio
      }))
    );
  }

  finalizarRecepcion(idTurno: string, horaFin: string): Observable<any> {
    // Primero obtener el turno para saber qué jaula liberar
    return this.http.get<Turno>(`${this.apiUrl}/${idTurno}`).pipe(
      switchMap(turno => {
        if (!turno.idJaula) {
          throw new Error('No hay jaula asignada a este turno');
        }
        
        // Liberar la jaula (actualizar a N)
        return this.http.patch(`${this.jaulasUrl}/${turno.idJaula}`, {
          enUso: 'N'
        }).pipe(
          // Luego actualizar el turno con hora de fin
          switchMap(() => this.http.patch<Turno>(`${this.apiUrl}/${idTurno}`, {
            horaFinRecepcion: horaFin
          }))
        );
      })
    );
  }

  getTurnosPorFecha(fecha: string): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}?fecha=${fecha}`);
  }

  // Utilidades (Módulo 4)
  generarOpcionesHoras(): string[] {
    const horas: string[] = [];
    for (let hora = 7; hora <= 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaStr = hora.toString().padStart(2, '0');
        const minutoStr = minuto.toString().padStart(2, '0');
        horas.push(`${horaStr}:${minutoStr}`);
      }
    }
    return horas;
  }
}