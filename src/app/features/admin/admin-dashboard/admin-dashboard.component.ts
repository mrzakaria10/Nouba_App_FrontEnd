import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminService, AdminSummary } from '../../../core/services/admin.service';
import { TicketService } from '../../../core/services/ticket.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    AdminSidebarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms ease-out', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', 
          style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit {
  // Initialize with default values
  summary: AdminSummary = {
    totalAgencies: 0,
    totalClients: 0,
    totalPendingTickets: 0
  };
  
  isLoading = true;
  errorMessage: string | null = null;

  reservations: any[] = [];
  showModal = false;
  selectedReservation: any = null;

  accounts: any[] = [];
  showAll = false;
  selectedAccount: any = null;

  confirmed = false;

  constructor(private adminService: AdminService, private ticketService: TicketService) {}

  ngOnInit() {
    this.loadSummaryData();
    this.loadTodayReservations();
    this.loadActiveClients();
  }

  /**
   * Loads summary data from backend
   * Handles loading state and errors
   */
  loadSummaryData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getSummary().subscribe({
      next: (data: AdminSummary) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading admin summary:', err);
        this.errorMessage = 'Failed to load dashboard data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Loads today's reservations for recent activity (admin only)
   */
  loadTodayReservations(): void {
    this.ticketService.getTodayReservations().subscribe({
      next: (res) => {
        // If backend returns {data: [...], ...}
        this.reservations = res.data ? res.data : res;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations:', err);
        // Optionally show a toast or message
      }
    });
  }

  /** Load active clients/agencies for this week */
  loadActiveClients(): void {
    this.adminService.getActiveClientsThisWeek().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activations:', err);
      }
    });
  }

  /**
   * Opens the modal with reservation details
   */
  openDetails(reservation: any) {
    this.selectedReservation = reservation;
    this.showModal = true;
    this.confirmed = false; // Reset when opening
  }

  onConfirmReservation() {
    this.confirmed = true;
    setTimeout(() => {
      this.closeModal();
    }, 700); // Optional: close after 0.7s for feedback
  }

  /** Toggle show all/less accounts */
  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  /** Open profile modal */
  openProfile(account: any): void {
    this.selectedAccount = account;
    this.showModal = true;
  }

  /**
   * Closes the modal
   */
  closeModal() {
    this.showModal = false;
    this.selectedReservation = null;
    this.confirmed = false;
  }

  /**
   * Retry loading data if there was an error
   */
  onRetry(): void {
    this.loadSummaryData();
  }
}