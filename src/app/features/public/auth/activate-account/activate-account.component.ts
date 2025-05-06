import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ActivateAccountComponent implements OnInit {
  isActivating = true;
  isSuccess = false;
  errorMessage: string | null = null;
  token: string | null = null;
  email: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
    alert(this.token);
    
    if (!this.token) {
      alert('Token d\'activation invalide ou manquant');
      this.errorMessage = 'Token d\'activation invalide ou manquant';
      this.isActivating = false;
      return;
    }

    this.activateAccount();
  }

  private activateAccount(): void {
        // Makes HTTP GET request to backend with token
    this.authService.activateAccount(this.token!).subscribe({
      next: () => {
                    // Success case - token is valid

        this.isSuccess = true;
        this.isActivating = false;
                    // Redirect to login after 3 seconds

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err: HttpErrorResponse) => {
                    // Error cases - token is invalid or expired

        this.isActivating = false;
        if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Le lien d\'activation est invalide';
        } else if (err.status === 403) {
          this.errorMessage = 'Token d\'activation invalide ou expiré';
        } else if (err.status === 404) {
          this.errorMessage = 'Le lien d\'activation n\'est plus valide. Veuillez contacter le support.';
        } else if (err.status === 500) {
          this.errorMessage = err.error?.message || 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'activation du compte. Veuillez réessayer plus tard.';
        }
        console.error('Activation error:', err);
        alert(this.errorMessage);
      }
    });
  }

  retryActivation(): void {
    if (this.email) {
      this.authService.resendActivationEmail(this.email).subscribe({
        next: () => {
          this.errorMessage = 'Un nouvel email d\'activation a été envoyé...';
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'envoi du nouvel email...';
        }
      });
    }
  }
}
