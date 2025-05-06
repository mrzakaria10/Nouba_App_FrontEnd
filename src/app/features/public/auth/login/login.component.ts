import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
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
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    // Check if we came from registration
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const email = navigation.extras.state['email'];
      if (email) {
        this.loginForm.patchValue({ email });
      }
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
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
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
