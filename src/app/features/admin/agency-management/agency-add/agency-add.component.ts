import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgenciesAdminService } from '../../../../core/services/agencies-admin.service';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from '../../../../core/services/ticket.service';

@Component({
  selector: 'app-agency-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agency-add.component.html',
  styleUrl: './agency-add.component.css'
})
export class AgencyAddComponent implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    cityId: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    photo: [null as File | null]
  });

  selectedPhotoFile: File | null = null;
  photoUrl: string | ArrayBuffer | null = null;
  loading = false;
  cities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private agenciesAdminService: AgenciesAdminService,
    private ticketService: TicketService,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.ticketService.getAllCities().subscribe({
      next: (response) => (this.cities = response.data),
      error: () => this.toastr.error('Erreur lors du chargement des villes', 'Erreur')
    });
  }

  onPhotoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhotoFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.form.patchValue({ photo: file });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const agency = { ...this.form.value, photo: this.selectedPhotoFile };
    const formData = this.agenciesAdminService.buildFormDataForCreate(agency);
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    this.loading = true;
    this.agenciesAdminService.createAgency(agency).subscribe({
      next: res => {
        this.loading = false;
        this.toastr.success('Agence créée avec succès', 'Succès');
        this.router.navigate(['/admin/agencies/list']);
      },
      error: err => {
        this.loading = false;
        this.toastr.error('Erreur lors de la création', 'Erreur');
      }
    });
  }

  // Ajoute cette méthode pour le bouton Annuler
  onCancel(): void {
    this.router.navigate(['/admin/agencies/list']);
  }
}
