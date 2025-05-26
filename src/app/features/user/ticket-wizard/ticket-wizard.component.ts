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
  services: any[] = [];
  selectedCity: any = null;
  selectedAgency: any = null;
  selectedService: any = null;
  ticketNumber: string = '';
  peopleAhead: number = 0;
  ticketForm: FormGroup;

  // For the two cards
  nextTicketNumberCustom: string | null = null;
  lastPendingTicketCustom: any = null;
  customTicketNumber: string = '';
  isLoadingCustom = false;

  nextTicketNumberAuto: string | null = null;
  lastPendingTicketAuto: any = null;
  isLoadingAuto = false;

  // Add a property to hold the created ticket details
  createdTicket: any = null;

  // IDs (set these from previous steps)
  agencyId!: number;
  clientId!: number;
  serviceId!: number;

  // Validation for custom ticket number
  get isCustomTicketNumberInvalid(): boolean {
    return !!this.customTicketNumber && !/^NOUBA\d{3}$/.test(this.customTicketNumber);
  }
  get isCustomTicketNumberValid(): boolean {
    return /^NOUBA\d{3}$/.test(this.customTicketNumber || '');
  }

  showAutoTicketSteps = false; // Ajoutez cette ligne
  showCustomTicketSteps = false; // Add this property

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
    this.showAutoTicketSteps = false; // Toujours initialiser à false au chargement
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
      } else if (this.currentStep === 3) { // Moving from Agency Selection to Service Selection (if selectedAgency is valid)
        // This case is handled by onAgencySelect directly setting currentStep = 4
      } else if (this.currentStep === 4 && this.selectedService) {
        // Load next and last ticket numbers for the agency
        this.ticketService.getNextTicketNumber(this.selectedAgency.id).subscribe({
          next: (res) => this.nextTicketNumberCustom = res.data
        });
        this.ticketService.getLastPendingTicket(this.selectedAgency.id).subscribe({
          next: (res) => this.lastPendingTicketCustom = res.data
        });
        this.currentStep = 5;
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

  onAgencySelect() {
    if (this.selectedAgency) {
      this.ticketService.getServicesByAgency(this.selectedAgency.id).subscribe({
        next: (response) => {
          this.services = response.data;
          this.currentStep = 4; // Move to Step 4: Service Selection
        },
        error: (error) => {
          console.error('Erreur lors du chargement des services:', error);
          alert('Erreur lors du chargement des services. Veuillez réessayer.');
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
        this.selectedService = null;
        this.services = [];
      } else if (this.currentStep === 2) { // Returned to City Selection
        this.selectedAgency = null;
        this.agencies = [];
      } else if (this.currentStep === 3) { // Returned to Agency Selection
        this.selectedService = null;
        this.services = [];
      }
    }
  }

  createTicket() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      alert('Erreur: Utilisateur non connecté');
      return;
    }
    if (!this.selectedAgency || !this.selectedAgency.id) {
      alert('Veuillez sélectionner une agence.');
      return;
    }
    if (!this.selectedService || !this.selectedService.id) {
      alert('Veuillez sélectionner un service.');
      return;
    }

    const agencyId = this.selectedAgency.id;
    const clientId = currentUser.id;
    const serviceId = this.selectedService.id;

    this.ticketService.createTicket(agencyId, clientId, serviceId).subscribe({
      next: (response) => {
        this.createdTicket = response.data; // Store all ticket data
        this.ticketNumber = response.data.number;
        this.peopleAhead = response.data.peopleAhead || 0;
        this.currentStep = 5; // Move to Step 5: Confirmation
      },
      error: (error) => {
        alert('Erreur lors de la création du ticket. Veuillez réessayer.');
      },
    });
  }

  // Load next available ticket number for both cards
  loadNextTicketNumber() {
    if (!this.agencyId) return;
    this.ticketService.getNextTicketNumber(this.agencyId).subscribe({
      next: (res) => {
        this.nextTicketNumberAuto = res.data;
        this.nextTicketNumberCustom = res.data;
      }
    });
  }

  // Load last pending ticket for both cards
  loadLastPendingTicket() {
    if (!this.agencyId) return;
    this.ticketService.getLastPendingTicket(this.agencyId).subscribe({
      next: (res) => {
        this.lastPendingTicketAuto = res.data;
        this.lastPendingTicketCustom = res.data;
      }
    });
  }

  // Card 1: Générer automatiquement
  generateAutoTicket() {
    if (!this.agencyId || !this.clientId || !this.serviceId) return;
    this.isLoadingAuto = true;
    this.ticketService.createTicket(this.agencyId, this.clientId, this.serviceId).subscribe({
      next: (res) => {
        // Handle ticket creation success (show confirmation, etc.)
        this.isLoadingAuto = false;
        // Optionally reload last pending ticket
        this.loadLastPendingTicket();
      },
      error: () => {
        this.isLoadingAuto = false;
      }
    });
  }

  // Card 2: Générer avec numéro choisi
  generateCustomTicket() {
    if (!this.isCustomTicketNumberValid || !this.agencyId || !this.clientId || !this.serviceId) return;
    this.isLoadingCustom = true;
    this.ticketService.createTicketWithNumber(
      this.agencyId,
      this.clientId,
      this.serviceId,
      this.customTicketNumber
    ).subscribe({
      next: (res) => {
        this.createdTicket = res.data;
        this.isLoadingCustom = false;
        this.currentStep = 6; // Show confirmation
      },
      error: () => {
        this.isLoadingCustom = false;
      }
    });
  }

  finish() {
    this.router.navigate(['/']);
  }

  // Add this method to check authentication
  checkAuthentication() {
    // Replace with your real auth check logic
    if (!this.authService.isLoggedIn()) {
      // Redirect to login or show login modal
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // Call this when user clicks "Obtenir un ticket"
  onObtenirUnTicketClick() {
    if (this.checkAuthentication()) {
      this.currentStep = 5; // Show the two cards step
      this.loadLeftCardData();
      this.loadRightCardData();
    }
  }

  // LEFT CARD: load next number and last pending ticket
  loadLeftCardData() {
    if (!this.agencyId) return;
    this.ticketService.getNextTicketNumber(this.agencyId).subscribe({
      next: (res) => this.nextTicketNumberCustom = res.data
    });
    this.ticketService.getLastPendingTicket(this.agencyId).subscribe({
      next: (res) => this.lastPendingTicketCustom = res.data
    });
  }

  // RIGHT CARD: load next number and last pending ticket (can be same as left)
  loadRightCardData() {
    if (!this.agencyId) return;
    this.ticketService.getNextTicketNumber(this.agencyId).subscribe({
      next: (res) => this.nextTicketNumberAuto = res.data
    });
    this.ticketService.getLastPendingTicket(this.agencyId).subscribe({
      next: (res) => this.lastPendingTicketAuto = res.data
    });
  }

  openCustomTicketModal() {
    this.showCustomTicketSteps = true;
    this.currentStep = 1;
    // Optionally reset fields or load data here
  }

  createTicketWithNumber() {
    if (!this.isCustomTicketNumberValid || !this.selectedAgency || !this.selectedService) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      alert('Erreur: Utilisateur non connecté');
      return;
    }
    const agencyId = this.selectedAgency.id;
    const clientId = currentUser.id;
    const serviceId = this.selectedService.id;
    const ticketNumber = this.customTicketNumber;

    this.ticketService.createTicketWithNumber(agencyId, clientId, serviceId, ticketNumber).subscribe({
      next: (res) => {
        this.createdTicket = res.data;
        this.currentStep = 6; // Go to confirmation step in the modal
      },
      error: (err) => {
        alert('Erreur lors de la création du ticket personnalisé. Veuillez réessayer.');
      }
    });
  }
}
