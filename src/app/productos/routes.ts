import { Routes } from '@angular/router';
import { List } from './list/list';

export const PRODUCTOS_ROUTES: Routes = [
  { path: '', component: List },
  { 
    path: 'crear', 
    loadComponent: () => import('./create/create').then(m => m.Create)
  },
  { 
    path: 'editar/:id', 
    loadComponent: () => import('./edit/edit').then(m => m.Edit)
  }
];