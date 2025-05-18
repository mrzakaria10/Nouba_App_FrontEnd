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
  currentStep = 1; // Start at step 1: User Information
  fullName: string = ''; // Assuming this is already there
  // accountName: string = ''; // <-- Add this new property
  cities: any[] = [];
  agencies: any[] = [];
  selectedCity: any = null;
  selectedAgency: any = null;
  ticketNumber: string = '';
  peopleAhead: number = 0;
  ticketForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private ticketService: TicketService
  ) { 
    this.ticketForm = this.fb.group({
      // Define form controls if you plan to use reactive forms for validation
      // For now, accountName is directly bound with ngModel in the template
      // If you want to use this form, ensure your template is set up for it.
      // Example: accountName: ['', Validators.required]
    });
   }

  ngOnInit() {
    this.loadUserInformation();
    // loadCities() will be called when navigating to the city selection step.
  }

  loadUserInformation(): void {
    // 1. Set fullName from the general user name stored by AuthService
    this.fullName = this.authService.getUserName();

    // // 2. Set accountName by decoding the token and looking for a specific claim
    // const tokenPayload = this.authService.getDecodedTokenPayload();
    // if (tokenPayload) {
    //   // IMPORTANT: Replace 'your_account_name_claim' with the actual claim name
    //   // used in your JWT token for the account name.
    //   // Examples: 'account_name', 'nom_compte', 'client_reference', etc.
    //   if (tokenPayload.your_account_name_claim) {
    //     this.accountName = tokenPayload.your_account_name_claim;
    //   } else {
    //     this.accountName = 'N/A'; // Or default to fullName, or an empty string
    //     console.warn('Specific account name claim ("your_account_name_claim") not found in token. Defaulting accountName.');
    //   }
    // } else {
    //   this.accountName = 'N/A'; // Or ''
    //   console.error('Could not decode token to retrieve account name. User might not be authenticated.');
    //   // Consider redirecting to login if critical information is missing
    //   // this.router.navigate(['/auth/login']);
    // }
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

  nextStep() {
    // Basic validation, enhance if using this.ticketForm
    if (this.fullName) {
      if (this.currentStep === 1) { // Moving from User Info to City Selection
        this.currentStep = 2;
        this.loadCities(); // Load cities for the city selection step
      } else if (this.currentStep === 2) { // Moving from City Selection to Agency Selection (if selectedCity is valid)
        // This case is handled by onCitySelect directly setting currentStep = 3
      }
    } else {
      alert('Vos informations (Nom et Nom du compte) semblent incomplètes. Veuillez vérifier.');
    }
  }

  onCitySelect() {
    if (this.selectedCity) {
      this.ticketService.getAgenciesByCity(this.selectedCity).subscribe({
        next: (response) => {
          this.agencies = response.data;
          this.currentStep = 3; // Move to Step 3: Agency Selection
        },
        error: (error) => {
          console.error('Erreur lors du chargement des agences:', error);
          alert('Erreur lors du chargement des agences. Veuillez réessayer.');
        }
      });
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      if (this.currentStep === 1) { // Returned to User Info
        this.selectedCity = null;
        this.cities = [];
        this.selectedAgency = null;
        this.agencies = [];
      } else if (this.currentStep === 2) { // Returned to City Selection
        this.selectedAgency = null;
        this.agencies = [];
      }
    }
  }

  createTicket() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.log('Erreur: Utilisateur non connecté');
      alert('Erreur: Utilisateur non connecté');
      return;
    }
    if (!this.selectedAgency || !this.selectedAgency.id) {
            console.log('Selected agency:', this.selectedAgency);
            

      alert('Veuillez sélectionner une agence.',);
      return;
    }

    const agencyId = this.selectedAgency.id;
    const clientId = currentUser.id;

    this.ticketService.createTicket(agencyId, clientId).subscribe({
      next: (response) => {
        this.ticketNumber = response.data.number;
        this.peopleAhead = response.data.peopleAhead || 0;
        this.currentStep = 4; // Move to Step 4: Confirmation
        console.log('Ticket created successfully:', response.data);
      },
      error: (error) => {
        console.error('Erreur lors de la création du ticket:', error);
        alert('Erreur lors de la création du ticket. Veuillez réessayer.');
      },
    });
  }

  finish() {
    this.router.navigate(['/']);
  }
}
