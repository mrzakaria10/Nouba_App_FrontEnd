import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;  // API expects string
  address: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root' // Ce service est disponible dans toute l'application
})
export class AuthService {
  private readonly baseUrl = `${environment.authUrl}`; // URL de base pour les endpoints d'authentification
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Récupérer l'utilisateur du localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Connecte un utilisateur
   * @param payload - Objet contenant email et mot de passe
   * @returns Observable avec la réponse du serveur
   */
  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
      tap(response => {
        // Stocke le token JWT dans le localStorage après une connexion réussie
        if (response?.data) {
          localStorage.setItem('token', response.data);
        }
      })
    );
  }

  /**
   * Enregistre un nouvel utilisateur
   * @param payload - Données d'inscription
   * @returns Observable avec la réponse du serveur
   */
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register-client`, payload);
  }

  /**
   * Demande de réinitialisation de mot de passe
   * @param email - Email de l'utilisateur
   * @returns Observable avec la réponse du serveur
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, { email });
  }

  /**
   * Réinitialise le mot de passe
   * @param payload - Token et nouveau mot de passe
   * @returns Observable avec la réponse du serveur
   */
  resetPassword(payload: { token: string; newPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, payload);
  }

  /**
   * Active un compte utilisateur
   * @param token - Token d'activation
   * @returns Observable avec la réponse du serveur
   */
  activateAccount(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/activate?token=${token}`);
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Récupère le token JWT
   * @returns Token JWT ou null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns boolean - true si connecté et token valide
   */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Récupère les rôles de l'utilisateur
   * @returns Tableau de rôles
   */
  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = this.parseJwt(token);
      return payload.roles || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Vérifie si l'utilisateur est admin
   * @returns boolean
   */
  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  /**
   * Vérifie si l'utilisateur est un client standard
   * @returns boolean
   */
  isUser(): boolean {
    return this.currentUserSubject.value?.role === 'user';
  }

  /**
   * Vérifie si l'utilisateur est une agence
   * @returns boolean
   */
  isAgency(): boolean {
    return this.currentUserSubject.value?.role === 'agency';
  }

  /**
   * Récupère l'email de l'utilisateur depuis le token
   * @returns string - Email de l'utilisateur
   */
  getEmail(): string {
    return this.currentUserSubject.value?.email || '';
  }

  /**
   * Parse un token JWT
   * @param token - Token JWT
   * @returns Payload décodé
   * @private
   */
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16).slice(-2)))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT token', e);
      return {};
    }
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUserRole(): string {
    return this.currentUserSubject.value?.role || '';
  }

  getUserName(): string {
    return this.currentUserSubject.value?.name || '';
  }
}
