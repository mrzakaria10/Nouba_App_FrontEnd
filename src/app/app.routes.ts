import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { agencyGuard } from './core/guards/agency.guard';
import { userGuard } from './core/guards/user.guard';
import { AgenciesListComponent } from './features/public/agencies/agencies-list/agencies-list.component';

/**
 * Routes principales de l'application
 * Définit la structure de navigation de l'application
 */
export const routes: Routes = [
  // Page d'accueil
  {
    path: '',
    loadComponent: () => import('./features/public/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },

  // Liste publique des agences
  {
    path: 'ListAgencies',
    loadComponent: () => import('./features/public/agencies/agencies-list/agencies-list.component').then(m => m.AgenciesListComponent),
    
  },
 
  {
    path: 'agency',
    loadChildren: () => import('./features/agency/agency.routes').then(m => m.AGENCY_ROUTES),
    canActivate: [agencyGuard]

  },
  // Routes d'administration
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // Routes d'authentification (chargées de manière paresseuse)
  {
    path: 'auth',
    loadChildren: () => import('./features/public/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Vérification des tickets
  {
    path: 'verifier',
    loadComponent: () => import('./features/public/verifier-ticket/verifier-ticket.component').then(m => m.VerifierTicketComponent)
  },

  // Page de contact
  {
    path: 'contact',
    loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent)
  },

  // Assistant de création de ticket
  {
    path: 'ticket-wizard',
    loadComponent: () => import('./features/user/ticket-wizard/ticket-wizard.component').then(m => m.TicketWizardComponent)
  },

  // FAQ
  {
    path: 'faq',
    loadComponent: () => import('./features/public/faq/faq.component').then(m => m.FaqComponent)
  },

  // Route par défaut - redirection vers la page d'accueil
  {
    path: '**',
    redirectTo: ''
  }
];