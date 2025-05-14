import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgencyService } from '../../../../core/services/agency.service';

import { AdminGuard } from '../../../../core/guards/admin.guard';


@Component({
  selector: 'app-agency-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agency-add.component.html',
  styleUrl: './agency-add.component.css'
})
export class AgencyAddComponent {
  form: FormGroup;
  photoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    public router: Router,
    private adminGuard: AdminGuard
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      cityName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      photo: [null, Validators.required]
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

      this.agencyService.createAgency(formData).subscribe({
        next: () => {
          console.log('Agency created successfully');
          this.router.navigate(['/admin/agency-management']);
        },
        error: (error) => {
          console.error('Error creating agency:', error);
        }
      });
    }
  }
}
