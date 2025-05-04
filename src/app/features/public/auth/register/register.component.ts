import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Register {
  name: string;
  email: string;
  password: string;
  phone: number;
  address: string;
  roles: string[];
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Nécessaire pour les formulaires réactifs
    RouterModule // Pour les directives routerLink
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  ngOnInit(): void {
    // Initialize any necessary data or perform setup tasks here
    console.log('RegisterComponent initialized');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      console.log('Form is invalid', this.registerForm.errors);
      return;
    }

    

    this.isLoading = true;
    this.errorMessage = null;

    // Create the Register object with phone as number
    const registerData: Register = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phone: Number(this.registerForm.value.phone), // Convert to number
      address: this.registerForm.value.address,
      roles: ['client']
    };
    console.log('Payload sent to backend:', registerData);

    // Create a DTO object for the API call with phone as string
    const apiData = {
      ...registerData,
      phone: this.registerForm.value.phone // Keep as string for API
    };

    this.authService.register(apiData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/auth/register-success'], {
          state: { email: registerData.email }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'inscription';
      }
    });
  }
}