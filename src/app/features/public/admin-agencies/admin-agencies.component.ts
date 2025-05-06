import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../../../core/services/agency.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-admin-agencies',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-agencies.component.html',
  styleUrl: './admin-agencies.component.css'
})
export class AdminAgenciesComponent implements OnInit {
  agencies: any[] = [];
  form: FormGroup;
  selectedAgency: any = null;
  showForm = false;
  isEdit = false;

  constructor(private agencyService: AgencyService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      address: [''],
      phone: [''],
      cityName: [''],
      email: [''],
      photo: [null]
    });
  }

  ngOnInit() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.agencyService.getAllAgencies().subscribe(data => this.agencies = data);
  }

  addAgency() {
    this.form.reset();
    this.selectedAgency = null;
    this.isEdit = false;
    this.showForm = true;
  }

  editAgency(agency: any) {
    this.form.patchValue(agency);
    this.selectedAgency = agency;
    this.isEdit = true;
    this.showForm = true;
  }

  deleteAgency(id: number) {
    if (confirm('Supprimer cette agence ?')) {
      this.agencyService.deleteAgency(id).subscribe(() => this.loadAgencies());
    }
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ photo: file });
    }
  }

  submit() {
    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      if (this.form.value[key] !== undefined && this.form.value[key] !== null) {
        formData.append(key, this.form.value[key]);
      }
    });
    if (this.isEdit && this.selectedAgency) {
      this.agencyService.updateAgency(this.selectedAgency.id, formData)
        .subscribe(() => { this.showForm = false; this.loadAgencies(); });
    } else {
      this.agencyService.createAgency(formData)
        .subscribe(() => { this.showForm = false; this.loadAgencies(); });
    }
  }
}
