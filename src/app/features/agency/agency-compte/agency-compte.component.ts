import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../../../core/services/agency.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Agency {
  name: string;
  address: string;
  phone: string;
  email: string;
  city: { name: string };
  photoUrl: string;
}

@Component({
  selector: 'app-agency-compte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agency-compte.component.html',
  styleUrls: ['./agency-compte.component.css']
})
export class AgencyCompteComponent implements OnInit {
  agency: Agency | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  // Add these properties for counts
  enAttenteCount = 0;
  enCoursCount = 0;
  annuleCount = 0;
  termineCount = 0;

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAgencyInfo();
    this.refreshCounts();
  }

  fetchAgencyInfo(): void {
    const agencyId = this.authService.getAgencyIdFromToken(); // Replace with dynamic ID if needed
    if (!agencyId) {
      this.errorMessage = 'Agency ID not found.';
      this.isLoading = false;
      return;
    }

    this.agencyService.getAgencyById(agencyId).subscribe({
      next: (agency) => {
        this.agency = agency;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load agency information.';
        this.isLoading = false;
      }
    });
  }

  refreshCounts(): void {
    const agencyId = this.authService.getAgencyIdFromToken();
    if (!agencyId) return;

    this.agencyService.getEnAttenteCountToday(agencyId).subscribe((res) => (this.enAttenteCount = res.data ?? res));
    this.agencyService.getEnCoursCountToday(agencyId).subscribe((res) => (this.enCoursCount = res.data ?? res));
    this.agencyService.getAnnuleCountToday(agencyId).subscribe((res) => (this.annuleCount = res.data ?? res));
    this.agencyService.getTermineCountToday(agencyId).subscribe((res) => (this.termineCount = res.data ?? res));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
