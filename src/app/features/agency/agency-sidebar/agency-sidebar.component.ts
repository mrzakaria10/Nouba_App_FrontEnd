import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AgencyService } from '../../../core/services/agency.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-agency-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agency-sidebar.component.html',
  styleUrl: './agency-sidebar.component.css'
})
export class AgencySidebarComponent implements OnInit {
  isCollapsed = false;
  agencyName = 'Agence';
  agencyAddress = '';

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get agency name from token (adjust the property name if needed)
    const user = this.authService.getCurrentUser();
    this.agencyName =  user?.name || 'Agence';
  }


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
