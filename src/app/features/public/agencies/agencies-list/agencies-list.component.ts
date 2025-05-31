import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AgencyService } from '../../../../core/services/agency.service';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';
// Interface pour une agence (adapte selon ton DTO backend)
export interface Agency {
  id: number;
  name: string;
  address: string;
  phone: string;
   city: {
    id: number;
    name: string;
  };
  photoUrl: string;
  // Le backend doit renvoyer le nom de la ville, pas l'ID
  // Ajoute d'autres champs si besoin (ex: photoUrl)
}

@Component({
  selector: 'app-agencies-list',
  templateUrl: './agencies-list.component.html',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  providers: [AgencyService]
})
export class AgenciesListComponent implements OnInit {
  agencies: any[] = [];

  // Ajoute ces propriétés pour la gestion du modal
  showModal = false;
  modalType: 'login' | '' = '';
  modalMessage = '';

  constructor(
    private agencyService: AgencyService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.agencyService.getAllAgencies().subscribe((data: Agency[]) => {
      this.agencies = data;
    });
  }

  handleTicketClick(): void {
    if (!this.authService.isAuthenticated()) {
      this.modalMessage = 'Veuillez vous connecter pour obtenir un ticket.';
      this.modalType = 'login';
      this.showModal = true;
    } 
  }

  // Optionnel : méthodes pour fermer ou agir sur le modal
  closeModal(): void {
    this.showModal = false;
    this.modalType = '';
    this.modalMessage = '';
  }

  goToLogin(): void {
    this.showModal = false;
    this.router.navigate(['/auth/login']);
  }
}