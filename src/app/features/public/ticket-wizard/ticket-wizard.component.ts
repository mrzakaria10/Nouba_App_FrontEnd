import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-wizard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './ticket-wizard.component.html',
  styleUrls: ['./ticket-wizard.component.css']
})
export class TicketWizardComponent {
  // Étape courante
  step = 1;

  // Données utilisateur
  fullName = '';
  selectedCity = '';
  selectedAgency = '';
  ticketNumber = '';

  // Villes et agences statiques
  cities = ['Rabat', 'Casablanca', 'Agadir'];
  agenciesByCity: { [key: string]: string[] } = {
    'Rabat': ['Nouba Rabat Centre', 'Nouba Rabat Agdal'],
    'Casablanca': ['Nouba Casa Maarif', 'Nouba Casa Anfa'],
    'Agadir': ['Nouba Agadir Plage', 'Nouba Agadir Centre']
  };

  // Aller à l'étape suivante
  nextStep() {
    if (this.step === 3) {
      this.ticketNumber = this.generateTicketNumber();
    }
    this.step++;
  }

  // Retour à l'étape précédente
  prevStep() {
    if (this.step > 1) this.step--;
  }

  // Obtenir les agences selon la ville choisie
  getAgencies() {
    return this.agenciesByCity[this.selectedCity] || [];
  }

  // Générer un numéro de ticket aléatoire
  generateTicketNumber(): string {
    return 'OT-' + Math.floor(100 + Math.random() * 900);
  }

  // Réinitialiser le wizard
  reset() {
    this.step = 1;
    this.fullName = '';
    this.selectedCity = '';
    this.selectedAgency = '';
    this.ticketNumber = '';
  }
}
