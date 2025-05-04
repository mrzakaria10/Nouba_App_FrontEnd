import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { agencyGuard } from './core/guards/agency.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'agencies',
    loadComponent: () => import('./features/public/agencies/agencies-list/agencies-list.component').then(m => m.AgenciesListComponent),
    canActivate: [userGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/agency/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [agencyGuard]
  },
  {
    path: 'agencies/manage',
    loadComponent: () => import('./features/admin/agencies-manage/agencies-manage.component').then(m => m.AgenciesManageComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/public/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'verifier',
    loadComponent: () => import('./features/public/verifier-ticket/verifier-ticket.component').then(m => m.VerifierTicketComponent)
  },
  
  {
    path: '**',
    redirectTo: ''
  }
];