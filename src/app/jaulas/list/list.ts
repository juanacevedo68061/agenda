import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Jaula } from '../model';
import { Header } from '../../header/header';

@Component({
  selector: 'app-jaula-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnInit {
  jaulas: Jaula[] = [];
  isLoading = true;

  constructor(
    private Service: Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.Service.getAll().subscribe({
      next: (data) => {
        this.jaulas = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jaulas:', error);
        this.isLoading = false;
      }
    });
  }

  delete(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta jaula?')) {
      this.Service.delete(id).subscribe({
        next: () => this.load(),
        error: (error) => console.error('Error deleting jaula:', error)
      });
    }
  }

}