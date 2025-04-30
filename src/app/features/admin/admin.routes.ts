import { Routes } from '@angular/router';


import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AgencyListComponent } from './agency-management/agency-list/agency-list.component';
import { AgencyAddComponent } from './agency-management/agency-add/agency-add.component';
import { AgencyEditComponent } from './agency-management/agency-edit/agency-edit.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      // dashboard
      {path: 'dashboard', component:AdminDashboardComponent},

      // Agencies
      { path: 'agencies', component: AgencyListComponent },
      { path: 'agencies/add', component: AgencyAddComponent },
      { path: 'agencies/edit/:id', component: AgencyEditComponent },

    ]
  }
];
