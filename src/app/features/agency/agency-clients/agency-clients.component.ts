import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../../../core/services/agency.service';
import { AuthService } from '../../../core/services/auth.service';

interface Client {
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-agency-clients',
  standalone: true,
  imports: [],
  templateUrl: './agency-clients.component.html',
  styleUrls: ['./agency-clients.component.css']
})
export class AgencyClientsComponent implements OnInit {
  clients: Client[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private agencyService: AgencyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    const agencyId = this.authService.getAgencyIdFromToken(); // Assuming this method exists
    if (!agencyId) {
      this.errorMessage = 'Agency ID not found.';
      this.isLoading = false;
      return;
    }

    this.agencyService.getAgencyClients(agencyId).subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load clients.';
        this.isLoading = false;
      }
    });
  }
}
