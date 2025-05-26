/**
 * Authentication Service
 * This service handles all authentication-related operations including:
 * - User login/logout
 * - User registration
 * - Password management
 * - Token management
 * - User role management
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

/**
 * Interface defining the structure of registration data
 * Required fields for user registration
 */
interface RegisterPayload {
  name: string;      // User's full name
  email: string;     // User's email address
  password: string;  // User's password
  phone: string;     // User's phone number (stored as string)
  address: string;   // User's physical address
  roles: string[];   // Array of user roles
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root' // Makes the service available throughout the application
})
export class AuthService {
  // Base URL for authentication endpoints
  private readonly baseUrl = `${environment.authUrl}`;
  
  // BehaviorSubject to store and observe current user state
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Authenticates a user and creates a session
   * @param payload - Object containing email and password
   * @returns Observable with server response
   */
  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap(response => {
        if (response?.data) {
          const token = response.data;
          localStorage.setItem('token', token);
          
          try {
            const userInfo = this.parseJwt(token);
            console.log('=== User Authentication Details ===');
            console.log('Token received:', token);
            console.log('Decoded user info:', userInfo);
            console.log('User role:', userInfo.role);
            console.log('User email:', userInfo.email);
            console.log('User name:', userInfo.name);
            console.log('User ID:', userInfo.id);
            console.log('================================');
            
            if (userInfo) {
              this.setCurrentUser({
                id: userInfo.id || 0,
                email: userInfo.email || '',
                name: userInfo.name || '',
                roles: userInfo.roles || []
              });
              // Show alert with user role
              alert(`Connexion réussie!\nRôle: ${userInfo.role}\nNom: ${userInfo.name}\nID: ${userInfo.id}`);
            }
          } catch (error) {
            console.error('Error processing login response:', error);
            alert('Erreur lors de la connexion. Veuillez réessayer.');
          }
        }
      })
    );
  }

  /**
   * Registers a new user in the system
   * @param payload - Complete user registration data
   * @returns Observable with server response
   */
  register(payload: RegisterPayload): Observable<any> {
    console.log(`${this.baseUrl}/register-client`);
    return this.http.post<any>(`${this.baseUrl}/register-client`, payload);
  }

  /**
   * Initiates the password reset process
   * @param email - User's email address
   * @returns Observable with server response
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email });
  }

  /**
   * Completes the password reset process
   * @param payload - Object containing reset token and new password
   * @returns Observable with server response
   */
  
resetPassword(payload: { token: string; newPassword: string }) {
  return this.http.post<any>(`${this.baseUrl}/reset-password`, payload);
}

  /**
   * Activates a user account using the activation token
   * @param token - Activation token received via email
   * @returns Observable with server response
   */
  activateAccount(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/activate?token=${token}`);
  }

  /**
   * Logs out the current user and clears session data
   * Redirects to login page after logout
   */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Retrieves the current JWT token from storage
   * @returns JWT token string or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Checks if a user is currently logged in
   * @returns boolean indicating login status
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    const user = this.currentUserSubject.value;
    return !!(token && user);
  }

  /**
   * Retrieves the user's roles from the JWT token
   * @returns Array of role strings
   */
  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    console.log(token);

    try {
      const payload = this.parseJwt(token);
      console.log('User roles:', payload.roles);
      return payload.roles || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Checks if the current user has admin role
   * @returns boolean indicating admin status
   */
  isAdmin(): boolean {
    console.log(this.currentUserSubject.value);
    const roles = this.currentUserSubject.value?.roles || []; 
    return roles.includes('ROLE_ADMIN');
  }

  /**
   * Checks if the current user has agency role
   * @returns boolean indicating agency status
   */
  isAgency(): boolean {
    const roles = this.currentUserSubject.value?.roles || [];
    return roles.includes('ROLE_AGENCY');
  }

  /**
   * Checks if the current user has client role
   * @returns boolean indicating client status
   */
  isClient(): boolean {
    const roles = this.currentUserSubject.value?.roles || [];
    return roles.includes('ROLE_CLIENT');
  }

  /**
   * Retrieves the current user's email
   * @returns User's email address or empty string
   */
  getEmail(): string {
    return this.currentUserSubject.value?.email || '';
  }

  /**
   * Parses and decodes a JWT token
   * @param token - JWT token string
   * @returns Decoded token payload
   * @private
   */
  private parseJwt(token: string): any {
    try {
      if (!token) {
        console.error('No token provided');
        return {};
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format');
        return {};
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if needed
      const pad = base64.length % 4;
      const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;

      const jsonPayload = decodeURIComponent(
        atob(paddedBase64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const parsed = JSON.parse(jsonPayload);
      console.log('Parsed JWT payload:', parsed);
      return parsed;
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return {};
    }
  }

  /**
   * Updates the current user state
   * @param user - User object containing user information
   */
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Retrieves the current user's role
   * @returns User's role or empty string
   */
  getUserRole(): string {
    const roles = this.currentUserSubject.value?.roles || [];
    return roles[0] || ''; // Return first role or empty string
  }

  /**
   * Retrieves the current user's name
   * @returns User's name or empty string
   */
  getUserName(): string {
    return this.currentUserSubject.value?.name || '';
  }

  /**
   * Retrieves the agency name if user is an agency
   * @returns Agency name or default value
   */
  getAgencyName(): string {
    if (this.isAgency()) {
      return this.currentUserSubject.value?.name || 'Agence';
    }
    return 'Agence';
  }

  /**
   * Retrieves the admin name if user is an admin
   * @returns Admin name or default value
   */
  getAdminName(): string {
    if (this.isAdmin()) {
      return this.currentUserSubject.value?.name || 'Administrateur';
    }
    return 'Administrateur';
  }

  /**
   * Returns the agency role string
   * @returns 'agency' role string
   */
  getAgencyRole(): string {
    return 'agency';
  }

  /**
   * Returns the admin role string
   * @returns 'admin' role string
   */
  getAdminRole(): string {
    return 'admin';
  }

  /**
   * Resends the activation email to a user
   * @param email - User's email address
   * @returns Observable with server response
   */
  resendActivationEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resend-activation`, { email });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.roles.includes(role) || false;
    
  }

  getCurrentUser(): { id: number; name: string; email: string; roles: string[] } | null {
    const tokenPayload = this.getDecodedTokenPayload();
    if (tokenPayload) {
      return {
        id: tokenPayload.id, // Ensure the backend includes the client ID in the token
        name: tokenPayload.name,
        email: tokenPayload.email,
        roles: tokenPayload.roles,
      };
    }
    return null;
  }

  /**
   * Retrieves the full decoded payload of the JWT token.
   * @returns Decoded token payload or null if no token/error.
   */
  public getDecodedTokenPayload(): any | null {
    const token = this.getToken();
    if (token) {
      return this.parseJwt(token);
    }
    return null;
  }

  /**
   * Retrieves the agency ID from the JWT token payload.
   * @returns Agency ID (number) or null if not found.
   */
  getAgencyIdFromToken(): number | null {
    const payload = this.getDecodedTokenPayload();
    if (payload && payload.agencyId) {
      return payload.agencyId;
    }
    return null;
  }
}
