import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AgencyService {
  private resourceUrl = environment.apiUrl + '/agencies';
  private adminUrl = environment.apiUrl + '/admin/agencies';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllAgencies() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.resourceUrl, { headers });
  }

  createAgency(agency: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = this.buildFormDataForCreate(agency);
    return this.http.post(this.adminUrl, formData, { headers });
  }

  updateAgency(id: number, agency: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = this.buildFormDataForUpdate(agency);
    return this.http.put(`${this.adminUrl}/${id}`, formData, { headers });
  }

  deleteAgency(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.adminUrl}/${id}`, { headers });
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
}
