import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'})
export class AgenciesAdminService {
  private apiUrl = `${environment.apiUrl}/admin/agencies`;
    private apiagency = `${environment.apiUrl}/agencies`;


  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // private getHeaders(): HttpHeaders {
  //   const token = this.authService.getToken();
  //   return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  // }

  // Get all agencies (admin view)
  getAllAgencies(): Observable<any> {
     const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiagency, { headers});
  }

  // Get agency by ID
  getAgencyById(id: number): Observable<any> {
     const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiagency}/${id}`, { headers});
  }

  // Create new agency
  createAgency(agency: any): Observable<any> {
     console.log("agency", agency);
    // const token = this.authService.getToken();
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = this.buildFormDataForCreate(agency);
    return this.http.post(this.apiUrl, formData, { headers});
  }

  updateAgency(id: number, agency: any): Observable<any> {
    // const token = this.authService.getToken();
    console.log("agency", agency);
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = this.buildFormDataForUpdate(agency);
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers });
  }
   

  // // Update agency
  // updateAgency(id: number, formData: FormData): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() });
  // }

  // Delete agency
  deleteAgency(id: number): Observable<any> {
     console.log("ID-agency", id);
     const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers});
  }

  public buildFormDataForCreate(agency: any): FormData {
    const formData = new FormData();
    formData.append('name', agency.name);
    formData.append('address', agency.address);
    formData.append('phone', agency.phone);
    formData.append('email', agency.email);
   
    formData.append('password', agency.password);
    formData.append('cityId', agency.cityId);
    if (agency.photo && agency.photo instanceof File) {
      formData.append('photo', agency.photo);
    }

    return formData;
  }

  public buildFormDataForUpdate(agency: any): FormData {
    const formData = new FormData();
    formData.append('name', agency.name ?? '');
    formData.append('address', agency.address ?? '');
    formData.append('phone', agency.phone ?? '');
    formData.append('email', agency.email ?? '');
    formData.append('cityId', agency.cityId?.toString() ?? '');
    if (agency.photo && agency.photo instanceof File) {
      formData.append('photo', agency.photo);
    }
    return formData;
  }
}
