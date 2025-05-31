import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Router } from '@angular/router';


interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './faq.component.html',
  styles: [`
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .faq-item {
      background: white;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .faq-question {
      padding: 1.5rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #1a365d;
    }
    .faq-answer {
      padding: 0 1.5rem 1.5rem;
      color: #4a5568;
      line-height: 1.6;
    }
    .faq-icon {
      transition: transform 0.3s ease;
    }
    .faq-icon.open {
      transform: rotate(180deg);
    }
  `]
})
export class FaqComponent {
  faqItems: FaqItem[] = [
    {
      question: 'Comment puis-je créer un compte ?',
      answer: 'Pour créer un compte, cliquez sur le bouton "S\'inscrire" en haut à droite de la page. Remplissez le formulaire avec vos informations personnelles et suivez les instructions.',
      isOpen: false
    },
    {
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Si vous avez oublié votre mot de passe, cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre adresse e-mail et suivez les instructions envoyées.',
      isOpen: false
    },
    {
      question: 'Comment puis-je modifier mes informations personnelles ?',
      answer: 'Connectez-vous à votre compte, accédez à la section "Mon Profil" et cliquez sur "Modifier". Vous pourrez alors mettre à jour vos informations.',
      isOpen: false
    },
    {
      question: 'Comment contacter le support client ?',
      answer: 'Vous pouvez contacter notre support client par e-mail à support@nouba.com ou en utilisant le formulaire de contact sur notre site.',
      isOpen: false
    },
    {
      question: 'Quels sont les moyens de paiement acceptés ?',
      answer: 'Nous acceptons les cartes de crédit (Visa, Mastercard), PayPal, et les virements bancaires.',
      isOpen: false
    }
  ];

  constructor(private router: Router) {}

  toggleFaq(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }
}
