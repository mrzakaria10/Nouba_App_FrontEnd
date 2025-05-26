import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AgencyService } from '../../../core/services/agency.service';
import { AuthService } from '../../../core/services/auth.service';


interface Agency {
  id: number;
  name: string;
}

@Component({
  selector: 'app-agency-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agency-sidebar.component.html',
  styleUrl: './agency-sidebar.component.css'
})
export class AgencySidebarComponent implements OnInit {
  agency: Agency | null = null;
  isCollapsed = false;
  agencyName = 'Agence';
  isSidebarOpen = false; // <-- Added property

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    const agencyId = this.authService.getAgencyIdFromToken(); // <-- Use your method to get agencyId from JWT
    if (!agencyId) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.agencyService.getAgencyById(agencyId).subscribe(agency => {
      this.agency = agency;
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
