import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AgencyListComponent } from './agency-management/agency-list/agency-list.component';
import { AgencyAddComponent } from './agency-management/agency-add/agency-add.component';
import { AgencyEditComponent } from './agency-management/agency-edit/agency-edit.component';
import { AdminGuard } from '../../core/guards/admin.guard';

/**
 * Routes pour la section administration
 * Contient toutes les routes protégées par AdminGuard
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { 
        path: 'agencies',
        children: [
          { path: '', component: AgencyListComponent },
          { path: 'add', component: AgencyAddComponent },
          { path: 'edit/:id', component: AgencyEditComponent }
        ]
      }
    ]
  }
];
