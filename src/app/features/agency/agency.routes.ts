import { Routes } from '@angular/router';
import { AgencyLayoutComponent } from './agency-layout/agency-layout.component';
import { AgencyDashboardComponent } from './agency-dashboard/agency-dashboard.component';
import { AgencyClientsComponent } from './agency-clients/agency-clients.component';
import { AgencyCompteComponent } from './agency-compte/agency-compte.component';
import { AgencyHistoryComponent } from './agency-history/agency-history.component';
// Import other components as needed

export const AGENCY_ROUTES: Routes = [
  {
    path: '',
    component: AgencyLayoutComponent,
    children: [
      { path: 'dashboard', component: AgencyDashboardComponent },
      // Add more child routes here (tickets, history, clients, etc.)
            { path: 'clients', component: AgencyClientsComponent }, // Add this route
                { path: 'compte', component: AgencyCompteComponent }, // Add this route

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
 
  ];