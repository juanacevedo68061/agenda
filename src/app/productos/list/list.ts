import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Producto } from '../model';
import { Header } from '../../header/header';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnInit {
  productos: Producto[] = [];
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
        this.productos = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading productos:', error);
        this.isLoading = false;
      }
    });
  }

  delete(id: string): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.Service.delete(id).subscribe({
        next: () => this.load(),
        error: (error) => console.error('Error deleting producto:', error)
      });
    }
  }

}