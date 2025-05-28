import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUser = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Helper method to get headers with the Authorization token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch all users
getAllUsers(): Observable<any[]> {
  const headers = this.getHeaders();
  return this.http.get<any>(this.apiUser, { headers }).pipe(
    tap((response) => {
      console.log('Fetched users:', response); // Log the raw response
    }),
    map((response) => {
      // Extract the `data` field from the response
      return response.data || [];
    }),
    catchError((error) => {
      console.error('Error fetching users:', error);
      return throwError(() => new Error('Failed to fetch users.'));
    })
  );
}


}