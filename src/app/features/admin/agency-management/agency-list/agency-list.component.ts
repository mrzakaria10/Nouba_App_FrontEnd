import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../../../../core/services/agency.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agency-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './agency-list.component.html',
  styleUrl: './agency-list.component.css'
})
export class AgencyListComponent implements OnInit {
  agencies: any[] = [];
  showForm = false;
  isEdit = false;
  form: FormGroup;
  photoFile: File | null = null;

  constructor(
    private agencyService: AgencyService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      cityName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [null]
    });
  }

  ngOnInit() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.agencyService.getAllAgencies().subscribe({
      next: (data) => {
        console.log('Agencies loaded:', data);
        this.agencies = data;
      },
      error: (error) => {
        console.error('Error loading agencies:', error);
      }
    });
  }

  deleteAgency(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
      this.agencyService.deleteAgency(id).subscribe({
        next: () => {
          console.log('Agency deleted successfully');
          this.loadAgencies();
        },
        error: (error) => {
          console.error('Error deleting agency:', error);
        }
      });
    }
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      this.form.patchValue({ photo: file });
    }
  }

  submit() {
    if (this.form.valid) {
      const formData = new FormData();
      Object.keys(this.form.value).forEach(key => {
        if (this.form.value[key] !== null) {
          formData.append(key, this.form.value[key]);
        }
      });

      if (this.isEdit) {
        // Handle edit case
        const agencyId = this.form.get('id')?.value;
        this.agencyService.updateAgency(agencyId, formData).subscribe({
          next: () => {
            console.log('Agency updated successfully');
            this.showForm = false;
            this.loadAgencies();
          },
          error: (error) => {
            console.error('Error updating agency:', error);
          }
        });
      } else {
        // Handle add case
        this.agencyService.createAgency(formData).subscribe({
          next: () => {
            console.log('Agency created successfully');
            this.showForm = false;
            this.loadAgencies();
          },
          error: (error) => {
            console.error('Error creating agency:', error);
          }
        });
      }
    }
  }
}
