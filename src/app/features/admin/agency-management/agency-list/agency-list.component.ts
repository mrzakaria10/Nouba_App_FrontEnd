import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AgenciesAdminService } from '../../../../core/services/agencies-admin.service';
import { AdminService, AdminSummary } from '../../../../core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Agency } from '../../../../models/agency';

@Component({
  selector: 'app-agency-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agency-list.component.html',
  styleUrl: './agency-list.component.css',
  providers: [AgenciesAdminService]
})
export class AgencyListComponent implements OnInit {
  agencies: Agency[] = [];
  selectedAgency: Agency | null = null;
  summary: AdminSummary = {
    totalAgencies: 0,
    totalClients: 0,
    totalPendingTickets: 0
  };
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private agenciesAdminService: AgenciesAdminService,
    private adminService: AdminService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAgencies();
    this.loadSummaryData();
  }

  loadAgencies() {
    this.agenciesAdminService.getAllAgencies().subscribe((data: Agency[]) => {
      this.agencies = data;
    });
  }

  loadSummaryData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getSummary().subscribe({
      next: (data: AdminSummary) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading agency summary:', err);
        this.errorMessage = 'Failed to load summary data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  edit(id: number): void {
    // Navigate to the edit page with the agency ID
    this.router.navigate(['/admin/agencies/edit', id]);
  }

  openConfirmModal(agency: Agency) {
    this.selectedAgency = agency;
  }

  deleteAgency() {
    if (!this.selectedAgency || this.selectedAgency.id === undefined) {
      console.log('No agency selected or ID is undefined');
       return; }
    this.agenciesAdminService.deleteAgency(this.selectedAgency.id).subscribe({
      next: res => {
        this.toastr.success(res.message, 'Succès');
        this.loadAgencies();
        this.selectedAgency = null;
        this.router.navigate(['/admin/agencies']);
      },
      error: err => {
        this.toastr.error(err.error.message, 'Erreur');
      }
    });
  }
}
