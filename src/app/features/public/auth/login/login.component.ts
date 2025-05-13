import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../../../../shared/footer/footer.component";
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isLoading = false;
  isForgotPasswordLoading = false;
  errorMessage: string | null = null;
  forgotPasswordError: string | null = null;
  forgotPasswordSuccess = false;
  redirectTo: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
      return;
    }

    // Get redirect path from query params
    this.route.queryParams.subscribe(params => {
      if (params['redirectTo']) {
        this.redirectTo = params['redirectTo'];
      }
    });

    // Check if we came from registration
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const email = navigation.extras.state['email'];
      if (email) {
        this.loginForm.patchValue({ email });
      }
    }
  }

    redirectBasedOnRole(): void {
    // Standardize role checks to use 'ROLE_' prefix, assuming this is the correct format for authService.hasRole()
    // And fix syntax error for the default navigation
    if (this.redirectTo === '/ticket-wizard' && this.authService.hasRole('ROLE_CLIENT')) {
      this.router.navigate(['/ticket-wizard']);
    } else if (this.authService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.hasRole('ROLE_AGENCY')) {
      this.router.navigate(['/agency/dashboard']);
    } else if (this.authService.hasRole('ROLE_CLIENT')) {
      // If redirectTo was not '/ticket-wizard', navigate to a default client dashboard or redirectTo
      this.router.navigate([this.redirectTo !== '/dashboard' && this.redirectTo !== '/' ? this.redirectTo : '/client/dashboard']);
    } else {
      // Fallback to redirectTo if set, otherwise a general dashboard or landing page
      this.router.navigate([this.redirectTo && this.redirectTo !== '/' ? this.redirectTo : '/public/landing-page']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false; // Corrected: Set to false after successful login

        // Prioritize redirectTo if it's specific and user has the right role for it
        if (this.redirectTo && this.redirectTo !== '/dashboard' && this.redirectTo !== '/') {
          if (this.redirectTo === '/ticket-wizard') {
            if (this.authService.hasRole('ROLE_CLIENT')) {
              this.router.navigate([this.redirectTo]);
            } else {
              // User wants ticket-wizard but isn't client, fallback to role dashboard
              this.navigateToRoleDashboardOrDefault();
            }
          } else {
            // For other specific redirectTo values, navigate directly.
            // Consider adding role checks if other redirectTo paths are role-specific.
            this.router.navigate([this.redirectTo]);
          }
        } else {
          // No specific redirectTo, or it's a generic one, so navigate based on role
          this.navigateToRoleDashboardOrDefault();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }

  private navigateToRoleDashboardOrDefault(): void {
    if (this.authService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.hasRole('ROLE_AGENCY')) {
      this.router.navigate(['/agency/dashboard']);
    } else if (this.authService.hasRole('ROLE_CLIENT')) {
      this.router.navigate(['/client/dashboard']); // Default for client
    } else {
      this.router.navigate(['/public/landing-page']); // General fallback
    }
  }

  onForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  

    this.isForgotPasswordLoading = true;
    this.forgotPasswordError = null;
    this.forgotPasswordSuccess = false;

    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordSuccess = true;
        this.forgotPasswordForm.reset();
      },
      error: (err) => {
        this.isForgotPasswordLoading = false;
        this.forgotPasswordError = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}
