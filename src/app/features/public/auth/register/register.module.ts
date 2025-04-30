// This file has been removed as part of module restructuring
// The RegisterModule was previously used to:
// 1. Declare the RegisterComponent
// 2. Import necessary Angular modules (CommonModule, ReactiveFormsModule, RouterModule)
// 
// To remove this module:
// 1. Delete this file
// 2. Update any imports in other files that were using this module
// 3. Make sure the RegisterComponent is properly declared in another module
// 4. Update routing configurations if needed 

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
    ReactiveFormsModule,
    RouterModule
  ]
}) 

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    console.log('RegisterComponent initialized');
  }

  onSubmit(): void {
    console.log('Form submitted', this.registerForm.value);
    
    if (this.registerForm.invalid) {
      console.log('Form is invalid', this.registerForm.errors);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const registerData: Register = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phone: Number(this.registerForm.value.phone),
      address: this.registerForm.value.address,
      roles: ['client']
    };

    console.log('Sending registration data:', registerData);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.router.navigate(['/auth/register-success'], {
          state: { email: registerData.email }
        });
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'inscription';
      }
    });
  }
} 