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
  agency: any = {};
  enAttenteCount = 0;
  enCoursCount = 0;
  annuleCount = 0;
  termineCount = 0;

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      const agencyId = user.id;
      this.agencyService.getAgencyById(agencyId).subscribe(res => this.agency = res);

      this.agencyService.getEnAttenteCountToday(agencyId).subscribe(res => this.enAttenteCount = res.data ?? res);
      this.agencyService.getEnCoursCountToday(agencyId).subscribe(res => this.enCoursCount = res.data ?? res);
      this.agencyService.getAnnuleCountToday(agencyId).subscribe(res => this.annuleCount = res.data ?? res);
      this.agencyService.getTermineCountToday(agencyId).subscribe(res => this.termineCount = res.data ?? res);
    }
  }
}

