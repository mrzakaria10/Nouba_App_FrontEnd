import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AgenciesAdminService } from '../../../../core/services/agencies-admin.service';
import { ToastrService } from 'ngx-toastr';
import { Agency } from '../../../../models/agency';

// interface Agency {
//   id: number;
//   name: string;
//   address: string;
//   phone: string;
//   email: string;
//   city: {
//     id: number;
//     name: string;
//   };
//   photoUrl: string;

// }

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
  // isLoading = false;
  

  constructor(
    private agenciesAdminService: AgenciesAdminService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies() {
      this.agenciesAdminService.getAllAgencies().subscribe((data: Agency[]) => {
        this.agencies = data;
      });
    }
  // loadAgencies() {
  //   this.isLoading = true;
  //   this.agenciesAdminService.getAllAgencies().subscribe({
  //     next: (response) => {
  //       console.log('Agencies loaded:', response);
  //       this.agencies = response;
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading agencies:', error);
  //       this.toastr.error('Error loading agencies', 'Error');
  //       this.isLoading = false;
  //     }
  //   });
  // }

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
