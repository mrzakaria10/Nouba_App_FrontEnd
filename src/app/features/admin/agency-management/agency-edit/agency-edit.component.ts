import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgencyService } from '../../../../core/services/agency.service';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';

@Component({
  selector: 'app-agency-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './agency-edit.component.html',
  styleUrl: './agency-edit.component.css'
})
export class AgencyEditComponent implements OnInit {
  form: FormGroup;
  photoFile: File | null = null;
  agencyId: number;
  currentPhotoUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.agencyId = this.route.snapshot.params['id'];
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
    this.loadAgency();
  }

  loadAgency() {
    this.agencyService.getAllAgencies().subscribe({
      next: (agencies) => {
        const agency = agencies.find(a => a.id === this.agencyId);
        if (agency) {
          this.form.patchValue({
            name: agency.name,
            address: agency.address,
            phone: agency.phone,
            cityName: agency.city?.name,
            email: agency.email
          });
          this.currentPhotoUrl = agency.photoUrl;
        }
      },
      error: (error) => {
        console.error('Error loading agency:', error);
      }
    });
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

      this.agencyService.updateAgency(this.agencyId, formData).subscribe({
        next: () => {
          console.log('Agency updated successfully');
          this.router.navigate(['/admin/agency-management']);
        },
        error: (error) => {
          console.error('Error updating agency:', error);
        }
      });
    }
  }
}
