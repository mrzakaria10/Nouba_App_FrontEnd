import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  // État du menu mobile (ouvert/fermé)
  isMenuOpen = false;

  constructor(private authService: AuthService) {}

  // Fonction pour basculer l'ouverture/fermeture du menu mobile
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Fonction pour fermer le menu mobile (utile si on veut fermer après un clic sur un lien)
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Récupère le nom de l'utilisateur connecté
  getUserName(): string {
    return this.authService.getUserName() || 'Utilisateur';
  }

  // Vérifie le rôle de l'utilisateur
  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  isAgency(): boolean {
    return this.authService.getUserRole() === 'agency';
  }

  isUser(): boolean {
    return this.authService.getUserRole() === 'client';
  }

  // Déconnexion
  logout(): void {
    this.authService.logout();
  }
}