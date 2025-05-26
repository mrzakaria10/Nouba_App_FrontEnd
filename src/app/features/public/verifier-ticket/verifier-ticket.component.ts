import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { TicketService } from '../../../core/services/ticket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verifier-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: 'verifier-ticket.component.html',
  styles: []
})
export class VerifierTicketComponent implements OnInit {
  cities: any[] = [];
  agencies: any[] = [];
  selectedCity: any = null;
  selectedAgency: any = null;
  ticketNumber: string = '';
  isLoading = false;
  result: any = null;
  errorMessage: string | null = null;
  showPopup = false;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.ticketService.getAllCities().subscribe({
      next: (response) => {
        this.cities = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des villes:', error);
        alert('Erreur lors du chargement des villes. Veuillez réessayer.');
      }
    });
  }

  onCityChange() {
    this.selectedAgency = null;
    if (this.selectedCity) {
      this.ticketService.getAgenciesByCity(this.selectedCity.id).subscribe((res: any) => {
        this.agencies = res.data ? res.data : res;
      });
    } else {
      this.agencies = [];
    }
  }

  onSubmit() {
    this.errorMessage = null;
    this.result = null;
    if (!this.selectedCity || !this.selectedAgency || !this.ticketNumber) {
      this.errorMessage = "Veuillez remplir tous les champs.";
      this.showPopup = true;
      return;
    }
    this.isLoading = true;
    this.ticketService.verifyTicket(this.selectedCity.id, this.selectedAgency.id, this.ticketNumber).subscribe({
      next: (res: any) => {
        this.result = res.data; // res.data now contains id
        this.errorMessage = null;
        this.showPopup = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.result = null;
        this.errorMessage = err.error?.message || "Votre ticket n'est pas valide.";
        this.showPopup = true;
        this.isLoading = false;
      }
    });
  }

  closePopup() {
    this.showPopup = false;
  }

  // Cancel ticket if status is EN_ATTENTE
  cancelTicket() {
    console.log('Ticket to cancel:', this.result); // Add this line
    if (!this.result || !this.result.id) return;
    this.isLoading = true;
    this.ticketService.cancelTicket(this.result.id).subscribe({
      next: () => {
        this.result.status = 'ANNULE';
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de l'annulation du ticket.";
        this.isLoading = false;
      }
    });
  }

  // Return to landing page
  returnToLanding() {
    window.location.href = '/';
  }
}
