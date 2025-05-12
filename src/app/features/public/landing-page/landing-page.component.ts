import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TicketWizardComponent } from '../../user/ticket-wizard/ticket-wizard.component';
import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule, TicketWizardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  showModal = false;
  modalMessage = '';
  modalType = '';
  cities: any[] = [];
  selectedCity: any = null;
  agencies: any[] = [];
  selectedAgency: any = null;
  clientName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private ticketService: TicketService
  ) {
    // Récupérer le nom du client si connecté
    if (this.authService.isAuthenticated()) {
      this.clientName = this.authService.getUserName();
    }
  }

  getRoleBgClass(): string {
    if (this.authService.isAdmin()) return 'bg-gray-100';
    if (this.authService.isAgency()) return 'bg-blue-50';
    return 'bg-white';
  }

  showLoginModal(): void {
    this.modalMessage = 'Veuillez vous connecter pour obtenir un ticket.';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalMessage = '';
    this.modalType = '';
  }

  handleTicketClick(): void {
    if (!this.authService.isAuthenticated()) {
      this.modalMessage = 'Veuillez vous connecter pour obtenir un ticket.';
      this.modalType = 'login';
      this.showModal = true;
    } 
    // else if (!this.authService.hasRole('CLIENT')) {
    //   this.modalMessage = 'Seuls les clients peuvent obtenir des tickets.';
    //   this.modalType = 'error';
    //   this.showModal = true;
    // } 
    else {
      this.router.navigate(['/ticket-wizard']);
    }
  }

  loadCities() {
    this.ticketService.getAllCities().subscribe({
      next: (response) => {
        this.cities = response.data;
        this.router.navigate(['/ticket-wizard']);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des villes:', error);
        this.showErrorModal('Erreur lors du chargement des villes. Veuillez réessayer.');
      }
    });
  }

  proceedToLogin() {
    console.log('Proceeding to login'); // Debug log
    this.closeModal();
    this.router.navigate(['/auth/login']);
  }

  showErrorModal(message: string): void {
    this.modalMessage = message;
    this.modalType = 'error';
    this.showModal = true;
  }

  navigateToLogin(): void {
    this.closeModal();
    this.router.navigate(['/auth/login'], { queryParams: { redirectTo: '/ticket-wizard' } });
  }
}
