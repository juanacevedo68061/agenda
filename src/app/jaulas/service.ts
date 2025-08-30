import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jaula } from './model';

@Injectable({
  providedIn: 'root'
})
export class Service {
  private apiUrl = 'http://localhost:3000/jaulas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Jaula[]> {
    return this.http.get<Jaula[]>(this.apiUrl);
  }

  getById(id: string): Observable<Jaula> {
    return this.http.get<Jaula>(`${this.apiUrl}/${id}`);
  }

  create(jaula: Omit<Jaula, 'enUso'>): Observable<Jaula> {
    // Asignar valor por defecto 'N' automáticamente
    const jaulaConValorPorDefecto: Jaula = {
      ...jaula,
      enUso: 'N'
    };
    return this.http.post<Jaula>(this.apiUrl, jaulaConValorPorDefecto);
  }

  update(id: string, jaula: Jaula): Observable<Jaula> {
    return this.http.put<Jaula>(`${this.apiUrl}/${id}`, jaula);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}