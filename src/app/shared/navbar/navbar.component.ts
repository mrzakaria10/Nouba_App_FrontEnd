import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // État du menu mobile (ouvert/fermé)
  isMenuOpen = false;

  // Fonction pour basculer l'ouverture/fermeture du menu mobile
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Fonction pour fermer le menu mobile (utile si on veut fermer après un clic sur un lien)
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  
}