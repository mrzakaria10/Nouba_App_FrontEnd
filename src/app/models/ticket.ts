export interface Ticket {
  id: number;
  number: string; // Mapped from ticketNumber
  service: string;
  issuedAt: string; // Mapped from createdAt
  position: number;
  estimatedTime: string;
  status: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
  filteredTickets: Ticket[];
    hidden?: boolean; // Add this property

}

