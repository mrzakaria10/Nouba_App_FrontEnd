import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminAgenciesComponent } from '../../features/public/admin-agencies/admin-agencies.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: [`
    .navbar-admin { 
      box-shadow: 0 2px 4px rgba(26, 54, 93, 0.1);
    }
    .navbar-agency { 
      box-shadow: 0 2px 4px rgba(44, 82, 130, 0.1);
    }
    .navbar-client { 
      box-shadow: 0 2px 4px rgba(43, 108, 176, 0.1);
    }
    .navbar-guest { 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class NavbarComponent implements OnInit {
  // État du menu mobile (ouvert/fermé)
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('User role:', this.authService.getUserRole());
    console.log('User name:', this.authService.getUserName());
   
  }

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
    return this.authService.getUserName() || '';
  }

  getUserRole(): string {
    return this.authService.getUserRole();
  }

  isAdmin(): boolean {
    return this.getUserRole().toLowerCase() === 'admin';
  }

  isAgency(): boolean {
    return this.getUserRole() === 'agency';
  }

  isUser(): boolean {
    return this.getUserRole() === 'client';
  }

  getNavbarClass(): string {
    if (!this.isLoggedIn()) return 'navbar-guest';
    switch (this.getUserRole()) {
      case 'admin': return 'navbar-admin';
      case 'agency': return 'navbar-agency';
      case 'client': return 'navbar-client';
      default: return 'navbar-guest';
    }
  }

  // Déconnexion
  logout(): void {
    this.authService.logout();
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/auth/login') || url.startsWith('/auth/register');
  }
}