import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

interface AgencyResponse {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  city: {
    id: number;
    name: string;
  };
  photoUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AgencyService {
  private apiUrl = `${environment.apiUrl}/agencies`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllAgencies(): Observable<AgencyResponse[]> {
    return this.http.get<AgencyResponse[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAgencyById(id: number): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createAgency(agency: any): Observable<any> {
    const formData = this.buildFormDataForCreate(agency);
    return this.http.post(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  updateAgency(id: number, agency: any): Observable<any> {
    const formData = this.buildFormDataForUpdate(agency);
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() });
  }

  deleteAgency(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  //role agencu

  getDashboardStats(agencyId: number): Observable<{ waitingTickets: number, processedTickets: number, servedClients: number }> {
    return this.http.get<{ waitingTickets: number, processedTickets: number, servedClients: number }>(
      `${this.apiUrl}/${agencyId}/dashboard-stats`,
      { headers: this.getHeaders() }
    );
  }

  private buildFormDataForCreate(agency: any): FormData {
    const formData = new FormData();
    formData.append('name', agency.name);
    formData.append('address', agency.address);
    formData.append('phone', agency.phone);
    formData.append('email', agency.email);
    formData.append('password', agency.password);
    formData.append('cityId', agency.cityId.toString());
    if (agency.photo && agency.photo instanceof File) {
      formData.append('photo', agency.photo);
    }
    return formData;
  }

  private buildFormDataForUpdate(agency: any): FormData {
    const formData = new FormData();
    formData.append('name', agency.name);
    formData.append('address', agency.address);
    formData.append('phone', agency.phone);
    formData.append('email', agency.email);
    formData.append('cityId', agency.cityId.toString());
    if (agency.photo && agency.photo instanceof File) {
      formData.append('photo', agency.photo);
    }
    return formData;
  }

  getEnAttenteCountToday(agencyId: number) {
    return this.http.get<any>(
      `${this.apiUrl}/agency/${agencyId}/today/en-attente/count`,
      { headers: this.getHeaders() }
    );
  }

  getEnCoursCountToday(agencyId: number) {
    return this.http.get<any>(
      `${this.apiUrl}/agency/${agencyId}/today/en-cours/count`,
      { headers: this.getHeaders() }
    );
  }



  // Add similar methods for "annule" and "termine" if you have those endpoints
  getAnnuleCountToday(agencyId: number) {
    return this.http.get<any>(
      `${this.apiUrl}/agency/${agencyId}/today/annule/count`,
      { headers: this.getHeaders() }
    );
  }

  getTermineCountToday(agencyId: number) {
    return this.http.get<any>(
      `${this.apiUrl}/agency/${agencyId}/today/termine/count`,
      { headers: this.getHeaders() }
    );
  }
}
