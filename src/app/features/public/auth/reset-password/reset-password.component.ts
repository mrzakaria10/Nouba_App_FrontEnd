import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  success: string | null = null;
  error: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Lien de réinitialisation invalide ou expiré.';
    }
  }

  submit() {
    if (this.form.invalid || !this.token) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.authService.resetPassword({
      token: this.token,
      newPassword: this.form.value.newPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Votre mot de passe a été réinitialisé avec succès !';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la réinitialisation.';
      }
    });
  }
}
