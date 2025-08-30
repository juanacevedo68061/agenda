import { Routes } from '@angular/router';
import { Table } from './table/table';

export const TURNOS_ROUTES: Routes = [
  { path: '', component: Table }, // Módulo 5 - Tabla principal
  { 
    path: 'registrar', 
    loadComponent: () => import('./register/register').then(m => m.Register)
  },
];