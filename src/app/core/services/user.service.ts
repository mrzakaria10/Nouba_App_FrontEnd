import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service'; // If you have AuthService

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUser = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllUsers(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUser, { headers });
  }

  getUsersByRole(role: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUser}/role/${role}`, { headers });
  }
}