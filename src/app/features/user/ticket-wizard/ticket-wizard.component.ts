import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-ticket-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './ticket-wizard.component.html',
  styleUrls: ['./ticket-wizard.component.css']
})
export class TicketWizardComponent implements OnInit {
  currentStep = 1;
  cities: any[] = [];
  agencies: any[] = [];
  selectedCity: any = null;
  selectedAgency: any = null;
  ticketNumber: string = '';
  peopleAhead: number = 0;
  ticketForm: FormGroup;
  clientName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private ticketService: TicketService
  ) { 
    this.ticketForm = this.fb.group({
      fullName: ['', Validators.required]
    });
   }

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
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

  onCitySelect() {
    if (this.selectedCity) {
      this.ticketService.getAgenciesByCity(this.selectedCity).subscribe({
        next: (response) => {
          this.agencies = response.data;
          this.currentStep = 2;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des agences:', error);
          alert('Erreur lors du chargement des agences. Veuillez réessayer.');
        }
      });
    }
  }

  previousStep() {
    this.currentStep--;
  }

  createTicket() {
    const clientId = this.authService.getCurrentUser()?.id;
    if (!clientId) {
      console.log('Erreur: Utilisateur non connecté');
      alert('Erreur: Utilisateur non connecté');
      return;
    }

    this.ticketService.createTicket(this.selectedAgency, clientId).subscribe({
      next: (response) => {
        this.ticketNumber = response.data.number;
        this.peopleAhead = response.data.peopleAhead || 0;
        this.currentStep = 3;
      },
      error: (error) => {
        console.error('Erreur lors de la création du ticket:', error);
        alert('Erreur lors de la création du ticket. Veuillez réessayer.');
      }
    });
  }

  finish() {
    this.router.navigate(['/']);
  }
}
