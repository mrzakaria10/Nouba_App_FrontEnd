import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { FooterComponent } from "../../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketWizardComponent } from '../ticket-wizard/ticket-wizard.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule, TicketWizardComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  constructor(private authService: AuthService) {}

  getRoleBgClass(): string {
    if (!this.authService.isLoggedIn()) return 'bg-white';
    switch (this.authService.getUserRole()) {
      case 'admin': return 'bg-gradient-to-b from-blue-900/10 to-white';
      case 'agency': return 'bg-gradient-to-b from-blue-700/10 to-white';
      case 'client': return 'bg-gradient-to-b from-blue-500/10 to-white';
      default: return 'bg-white';
    }
  }
}
