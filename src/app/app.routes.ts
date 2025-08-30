import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { 
    path: 'proveedores', 
    loadChildren: () => import('./proveedores/routes').then(m => m.PROVEEDORES_ROUTES)
  },
  { 
    path: 'productos', 
    loadChildren: () => import('./productos/routes').then(m => m.PRODUCTOS_ROUTES)
  },
  { 
    path: 'jaulas', 
    loadChildren: () => import('./jaulas/routes').then(m => m.JAULAS_ROUTES)
  },
  { 
    path: 'turnos', 
    loadChildren: () => import('./turnos/routes').then(m => m.TURNOS_ROUTES)
  }
];