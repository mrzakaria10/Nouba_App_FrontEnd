import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

// Interface for the summary data
export interface AdminSummary {
  totalAgencies: number;
  totalClients: number;
  totalPendingTickets: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin/summary`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getSummary(): Observable<AdminSummary> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map(response => response.data) // Only return the summary data object
    );
  }

  getActiveClientsThisWeek(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${environment.apiUrl}/users/active-this-week`, { headers })
      .pipe(
        map(res => res.data ? res.data : res)
      );
  }

  resetAllTickets(): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(`${environment.apiUrl}/tickets/admin/reset-tickets`, {}, { headers });
}
}