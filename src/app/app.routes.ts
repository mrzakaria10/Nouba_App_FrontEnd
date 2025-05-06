import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { agencyGuard } from './core/guards/agency.guard';
import { userGuard } from './core/guards/user.guard';
import { AgenciesListComponent } from './features/public/agencies/agencies-list/agencies-list.component';
import { AdminAgenciesComponent } from './features/public/admin-agencies/admin-agencies.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'agencies',
    component: AgenciesListComponent
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
    path: 'contact',
    loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'ticket-wizard',
    loadComponent: () => import('./features/public/ticket-wizard/ticket-wizard.component').then(m => m.TicketWizardComponent)
  },

  {
    path: 'admin-agencies',
    loadComponent: () => import('./features/public/admin-agencies/admin-agencies.component').then(m => m.AdminAgenciesComponent),
    
  },
  {
    path: 'admin/agencies',
    component: AdminAgenciesComponent
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/public/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];