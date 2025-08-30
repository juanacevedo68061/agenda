import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Proveedor } from '../model';
import { Header } from '../../header/header';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnInit {
  proveedores: Proveedor[] = [];
  isLoading = true;

  constructor(private Service: Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.Service.getAll().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading proveedores:', error);
        this.isLoading = false;
      }
    });
  }

  delete(id: string): void {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.Service.delete(id).subscribe({
        next: () => this.load(),
        error: (error) => console.error('Error deleting proveedor:', error)
      });
    }
  }
}