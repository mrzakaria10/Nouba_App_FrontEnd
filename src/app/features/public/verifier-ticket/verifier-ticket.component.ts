import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
// Si tu veux utiliser ReactiveForms plus tard, tu peux l'importer ici

@Component({
  selector: 'app-verifier-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: 'verifier-ticket.component.html',
  styles: []
})
export class VerifierTicketComponent {
  // ===========================
  // Composant pour la page "Vérifier votre ticket"
  // ===========================

  // Ici tu peux déclarer des variables pour stocker le numéro de ticket saisi par l'utilisateur
  // Exemple :
  // ticketNumber: string = '';

  // Si tu veux gérer la soumission du formulaire :
  // onSubmit() {
  //   // Appeler un service pour vérifier le ticket via une API
  //   // Afficher le résultat à l'utilisateur
  // }

  // Pour l'instant, ce composant affiche juste le formulaire de vérification
  // La logique métier peut être ajoutée ici plus tard
}
