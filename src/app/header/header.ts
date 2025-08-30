import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  
  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToProveedores(): void {
    this.router.navigate(['/proveedores']);
  }

  goToProductos(): void {
    this.router.navigate(['/productos']);
  }

  goToJaulas(): void {
    this.router.navigate(['/jaulas']);
  }

  goToTurnos(): void {
    this.router.navigate(['/turnos']);
  }

  // Método para verificar si está en la página actual
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}