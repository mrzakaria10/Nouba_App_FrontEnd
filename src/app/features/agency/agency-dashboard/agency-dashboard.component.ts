import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../../../core/services/agency.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agency-dashboard',
  standalone: true,
   imports: [CommonModule], // <-- Add CommonModule here
  templateUrl: './agency-dashboard.component.html',
  styleUrls: ['./agency-dashboard.component.css']
})
export class AgencyDashboardComponent implements OnInit {
  agency: any = null;

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.agencyService.getAgencyById(user.id).subscribe({
        next: (agency) => {
          this.agency = agency;
        }
      });
    }
  }
}

