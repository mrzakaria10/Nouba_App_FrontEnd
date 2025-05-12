import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  userName = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log('=== Navbar Component Initialized ===');
    console.log('Is admin:', this.authService.isAdmin());
    console.log('Is agency:', this.authService.isAgency());
    console.log('Is client:', this.authService.isClient());
    console.log('================================');

    this.userName = this.authService.getUserName();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAgency(): boolean {
    return this.authService.isAgency();
  }

  isClient(): boolean {
    return this.authService.isClient();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login'], { queryParams: { redirectTo: '/landing-page' } });
  }

  getUserName(): string {
    return this.authService.getUserName();
  }

  getNavbarClass(): string {
    if (!this.isLoggedIn()) {
      return 'navbar-guest';
    }
    
    if (this.isAdmin()) {
      return 'navbar-admin';
    } else if (this.isAgency()) {
      return 'navbar-agency';
    } else if (this.isClient()) {
      return 'navbar-client';
    }
    
    return 'navbar-guest';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/auth/login') || url.startsWith('/auth/register');
  }

  logout() {
    this.authService.logout();
  }
}