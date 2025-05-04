import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RegisterSuccessComponent implements OnInit {
  email: string = '';
  isActivating = false;
  isSuccess = false;
  errorMessage: string | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.email = navigation.extras.state['email'];
    }
  }

  ngOnInit(): void {
    if (!this.email) {
      this.router.navigate(['/auth/register']);
    }
  }
} 