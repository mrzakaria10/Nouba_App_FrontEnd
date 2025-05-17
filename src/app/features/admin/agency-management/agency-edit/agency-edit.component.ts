import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgenciesAdminService } from '../../../../core/services/agencies-admin.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agency-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agency-edit.component.html',
  styleUrl: './agency-edit.component.css'
})
export class AgencyEditComponent implements OnInit {
  agencyId!: number;
  cities: any[] = [];
  selectedPhotoFile: File | null = null;
  photoUrl: string | ArrayBuffer | null = null;
  currentPhotoUrl: string | null = null;
  loading = false;
  backendUrl = 'http://localhost:8080/api/uploads/'; // Adjust to your backend's static files path

  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    cityId: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    photo: [null as File | null]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private agenciesAdminService: AgenciesAdminService,
    private ticketService: TicketService,
public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.agencyId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Editing agency with ID:', this.agencyId); // Debug line
    this.ticketService.getAllCities().subscribe({
      next: (response) => (this.cities = response.data),
      error: () => this.toastr.error('Erreur lors du chargement des villes', 'Erreur')
    });

    this.agenciesAdminService.getAgencyById(this.agencyId).subscribe({
      next: (agency) => {
          console.log('Loaded agency:', agency); // Debug

        this.form.patchValue({
          name: agency.name,
          address: agency.address,
          phone: agency.phone,
          cityId: agency.city.id,
          email: agency.email
        });
        this.photoUrl = agency.photoUrl;
        this.currentPhotoUrl = agency.photoUrl;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement de l\'agence', 'Erreur');
        this.router.navigate(['/admin/agencies']);
      }
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
    const agency = this.form.value;
    if (this.selectedPhotoFile) {
      agency.photo= this.selectedPhotoFile;
    }
    const formData = this.agenciesAdminService.buildFormDataForUpdate(agency);
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    this.loading = true;
    this.agenciesAdminService.updateAgency(this.agencyId, agency).subscribe({
      next: res => {
        this.loading = false;
        this.toastr.success('Agence mise à jour avec succès', 'Succès');
        this.router.navigate(['/admin/agencies/list']);
      },
      error: err => {
        this.loading = false;
        this.toastr.error('Erreur lors de la mise à jour', 'Erreur');
      }
    });
  }
}
