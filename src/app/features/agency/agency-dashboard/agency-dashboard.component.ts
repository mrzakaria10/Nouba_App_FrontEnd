import { Component, OnInit, OnDestroy } from '@angular/core';
import { AgencyService } from '../../../core/services/agency.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule,  } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2'; // For popup notifications


interface Agency {
  id: number;
  name: string;
  address: string;
  phone: string;
  city: {
    id: number;
    name: string;
  };
  photoUrl: string;
}

interface Ticket {
  id: number;
  ticketNumber: string; // Mapped from ticketNumber
  service: string;
  createdAt: string; // Mapped from createdAt
  position: number;
  estimatedTime: string;
  status: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
}

@Component({
  selector: 'app-agency-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './agency-dashboard.component.html',
  styleUrls: ['./agency-dashboard.component.css']
})
export class AgencyDashboardComponent implements OnInit, OnDestroy {
  agency: Agency | null = null;
  enAttenteCount = 0;
  enCoursCount = 0;
  annuleCount = 0;
  termineCount = 0;
  tickets: Ticket[] = [];
  statusFilter: string = 'ALL'; // Add this line
  private ticketUpdateSubscription!: Subscription;

  currentTicket: any = null; // For left panel display

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const agencyId = this.authService.getAgencyIdFromToken();
    if (!agencyId) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.agencyService.getAgencyById(agencyId).subscribe(agency => {
      this.agency = agency;
    });

    this.refreshCounts();

    // Subscribe to ticket updates
    this.ticketUpdateSubscription = this.agencyService.ticketUpdates$.subscribe(() => {
      this.refreshCounts(); // Refresh data
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.ticketUpdateSubscription) {
      this.ticketUpdateSubscription.unsubscribe();
    }
  }

  // NEW: Fetch all tickets
  getAllTickets(agencyId: number) {
    this.agencyService.getAllTicketsByAgency(agencyId).subscribe(res => {
      this.tickets = res.data ?? res;
    });
  }

  // NEW: Ticket actions
  startTicket(ticket: Ticket) {
    this.agencyService.startTicket(ticket.id).subscribe(() => {
      ticket.status = 'EN_COURS';
      this.refreshCounts();
    });
  }

  cancelTicket(ticket: Ticket) {
    this.agencyService.cancelTicket(ticket.id).subscribe(() => {
      ticket.status = 'ANNULE';
      this.refreshCounts();
    });
  }

  completeTicket(ticket: Ticket) {
    this.agencyService.completeTicket(ticket.id).subscribe(() => {
      ticket.status = 'TERMINE';
      this.refreshCounts();
    });
  }

  // NEW: Refresh ticket counts after action
  refreshCounts() {
    const agencyId = this.authService.getAgencyIdFromToken();
    if (!agencyId) return;

    this.agencyService.getEnAttenteCountToday(agencyId).subscribe(res => this.enAttenteCount = res.data ?? res);
    this.agencyService.getEnCoursCountToday(agencyId).subscribe(res => this.enCoursCount = res.data ?? res);
    this.agencyService.getAnnuleCountToday(agencyId).subscribe(res => this.annuleCount = res.data ?? res);
    this.agencyService.getTermineCountToday(agencyId).subscribe(res => this.termineCount = res.data ?? res);
    this.getAllTickets(agencyId);
  }



  // NEW: Refresh dashboard with update check
  refreshDashboard() {
    const agencyId = this.authService.getAgencyIdFromToken();
    if (!agencyId) {
      console.error('No agency ID found.');
      return;
    }

    // Fetch agency details
    this.agencyService.getAgencyById(agencyId).subscribe(agency => {
      this.agency = agency;
    });

    // Refresh ticket counts
    this.agencyService.getEnAttenteCountToday(agencyId).subscribe(res => this.enAttenteCount = res.data ?? res);
    this.agencyService.getEnCoursCountToday(agencyId).subscribe(res => this.enCoursCount = res.data ?? res);
    this.agencyService.getAnnuleCountToday(agencyId).subscribe(res => this.annuleCount = res.data ?? res);
    this.agencyService.getTermineCountToday(agencyId).subscribe(res => this.termineCount = res.data ?? res);

    // Fetch all tickets and check for updates
    this.agencyService.getAllTicketsByAgency(agencyId).subscribe(newTickets => {
      if (newTickets.length !== this.tickets.length || !this.areTicketsEqual(newTickets, this.tickets)) {
        this.tickets = newTickets; // Update tickets
        this.showUpdateNotification('Mise à jour', 'De nouvelles modifications ont été apportées aux tickets.', 'success');
      } else {
        this.showUpdateNotification('Aucune mise à jour', 'Aucune modification n\'a été détectée.', 'info');
      }
    });
  }

  // Helper method to compare tickets
  private areTicketsEqual(newTickets: Ticket[], currentTickets: Ticket[]): boolean {
    if (newTickets.length !== currentTickets.length) {
      return false;
    }
    return newTickets.every((newTicket, index) => {
      const currentTicket = currentTickets[index];
      return (
        newTicket.id === currentTicket.id &&
        newTicket.status === currentTicket.status &&
        newTicket.position === currentTicket.position
      );
    });
  }

  // Show popup notification
  showUpdateNotification(title: string, text: string, icon: 'success' | 'info') {
    Swal.fire({
      title,
      text,
      icon,
      timer: 5000, // Show for 5 seconds
      showConfirmButton: false
    });
  }

  get filteredTickets(): Ticket[] {
    if (this.statusFilter === 'ALL') {
      return this.tickets;
    }
    return this.tickets.filter(ticket => ticket.status === this.statusFilter);
  }

  // Call this when "Appeler le prochain client" is clicked
  callNextClient() {
    const agencyId = this.authService.getAgencyIdFromToken();
    if (!agencyId) return;
    this.agencyService.startFirstPendingTicket(agencyId).subscribe(res => {
      if (res.data) {
        this.currentTicket = res.data; // res.data should have id, ticketNumber, etc.
        // Optionally show a notification or modal here
      } else {
        this.currentTicket = null;
        this.showUpdateNotification('Info', 'Aucun client en attente.', 'info');
      }
    });
  }

  // Validate (start service)
  validateCurrentTicket() {
    if (!this.currentTicket) return;
    this.agencyService.completeTicketService(this.currentTicket.ticketId).subscribe(() => {
      this.currentTicket = null;
      this.refreshCounts();
    });
  }

  // Cancel (pending)
  cancelCurrentTicket() {
    if (!this.currentTicket) return;
    this.agencyService.cancelActiveTicket(this.currentTicket.ticketId).subscribe(() => {
      this.currentTicket = null;
      this.refreshCounts();
    });
  }

  // Reset left panel
  resetCurrentTicket() {
    this.currentTicket = null;
  }
}