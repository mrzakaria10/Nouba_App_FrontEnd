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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token d\'activation invalide ou manquant';
      this.isActivating = false;
      return;
    }

    this.activateAccount();
  }

  private activateAccount(): void {
    this.authService.activateAccount(this.token!).subscribe({
      next: () => {
        this.isSuccess = true;
        this.isActivating = false;
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.isActivating = false;
        if (err.status === 403) {
          this.errorMessage = 'Accès refusé. Le token d\'activation est peut-être invalide ou expiré.';
        } else if (err.status === 404) {
          this.errorMessage = 'Le lien d\'activation n\'est plus valide. Veuillez contacter le support.';
        } else if (err.status === 400) {
          this.errorMessage = 'Le lien d\'activation est invalide. Veuillez vérifier l\'URL.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'activation du compte. Veuillez réessayer plus tard.';
        }
        console.error('Activation error:', err);
      }
    });
  }

  retryActivation(): void {
    if (this.token) {
      this.isActivating = true;
      this.errorMessage = null;
      this.activateAccount();
    }
  }
}
