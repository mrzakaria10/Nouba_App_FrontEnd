import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../../../core/services/agency.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common'; // <-- Add this import


interface Ticket {
  id: number;
  ticketNumber: string; // Mapped from ticketNumber
  service: string;
  createdAt: string; // Mapped from createdAt
  position: number;
  estimatedTime: string;
  status: 'TERMINE' | 'ANNULE';
}

@Component({
  selector: 'app-agency-history',
  standalone: true,
 imports: [CommonModule], // <-- Add CommonModule here

  templateUrl: './agency-history.component.html',
  styleUrls: ['./agency-history.component.css']
})
export class AgencyHistoryComponent implements OnInit {
  tickets: any[] = [];
  loading = true;

  constructor(private agencyService: AgencyService, private authService: AuthService) {}

  ngOnInit() {
    const agencyId = this.authService.getAgencyIdFromToken();
    if (agencyId) {
      this.agencyService.getAgencyTicketHistory(agencyId).subscribe(res => {
        this.tickets = (res.data ?? res).filter((t: any) =>
          t.status === 'ANNULE' || t.status === 'TERMINE'
        );
        this.loading = false;
      });
    }
  }
}
