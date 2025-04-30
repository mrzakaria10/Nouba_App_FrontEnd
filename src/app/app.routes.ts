import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/public/landing-page/landing-page.component').then(m => m.LandingPageComponent) 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/public/auth/auth.routes').then(m => m.AUTH_ROUTES) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];