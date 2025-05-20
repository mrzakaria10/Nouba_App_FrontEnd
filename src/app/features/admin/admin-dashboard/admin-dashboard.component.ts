import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminService, AdminSummary } from '../../../core/services/admin.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    AdminSidebarComponent
  ],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  // Initialize with default values
  summary: AdminSummary = {
    totalAgencies: 0,
    totalClients: 0,
    totalPendingTickets: 0
  };
  
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadSummaryData();
  }

  /**
   * Loads summary data from backend
   * Handles loading state and errors
   */
  loadSummaryData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getSummary().subscribe({
      next: (data: AdminSummary) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading admin summary:', err);
        this.errorMessage = 'Failed to load dashboard data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Retry loading data if there was an error
   */
  onRetry(): void {
    this.loadSummaryData();
  }
}