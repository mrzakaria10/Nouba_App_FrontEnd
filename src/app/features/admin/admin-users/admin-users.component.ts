import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  nonAdminCount: number = 0; // Count excluding ADMIN role
  clientCount: number = 0;
  agencyCount: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;

        // Calculate counts for non-ADMIN users
        this.nonAdminCount = this.users.filter((user) => user.role !== 'ADMIN').length;

        // Calculate counts for Client and Agence roles
        this.clientCount = this.users.filter((user) => user.role === 'CLIENT').length;
        this.agencyCount = this.users.filter((user) => user.role === 'AGENCY').length;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  // Example delete method (optional)
  deleteUser(id: number) {
    // Call your delete API and refresh users
  }
}
