import { Routes } from '@angular/router';
import { AgencyLayoutComponent } from './agency-layout/agency-layout.component';
import { AgencyDashboardComponent } from './agency-dashboard/agency-dashboard.component';
import { AgencyHistoryComponent } from './agency-history/agency-history.component';
// Import other components as needed

export const AGENCY_ROUTES: Routes = [
  {
    path: '',
    component: AgencyLayoutComponent,
    children: [
      { path: 'dashboard', component: AgencyDashboardComponent },
      // Add more child routes here (tickets, history, clients, etc.)
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'history',
   component: AgencyHistoryComponent
  },
  ];