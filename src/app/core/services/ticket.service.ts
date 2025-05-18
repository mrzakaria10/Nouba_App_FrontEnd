import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly baseUrl = `${environment.apiUrl}/tickets`;
  private readonly baseUrl2 = `${environment.apiUrl}`;
  // private readonly baseUrl = 'http://localhost:8080/api/tickets';


  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupérer toutes les villes
  getAllCities(): Observable<any> {
    return this.http.get(`${this.baseUrl2}/cities`, { headers: this.getHeaders() });
    // Uncomment the line below if you want to log the request  
    console.log(this.http.get(`${this.baseUrl2}/cities`, { headers: this.getHeaders() }));
  }

  // Récupérer les agences d'une ville
  getAgenciesByCity(cityId: number): Observable<any> {
    return this.http.get(`${this.baseUrl2}/cities/${cityId}/agencies`, { headers: this.getHeaders() });
  }

  // Créer un nouveau ticket avec agencyId et clientId dans l'URL
  createTicket(agencyId: number, clientId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/agency/${agencyId}/${clientId}`,
      {}, // empty body, unless your backend expects more
      { headers: this.getHeaders() }
    );
  }

  // Récupérer le statut d'un ticket
  getTicketStatus(ticketId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/${ticketId}/status`, { headers: this.getHeaders() });
  }

  // Récupérer le nombre de personnes devant dans la file
  getPeopleAhead(ticketId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tickets/${ticketId}/ahead`, { headers: this.getHeaders() });
  }
}
