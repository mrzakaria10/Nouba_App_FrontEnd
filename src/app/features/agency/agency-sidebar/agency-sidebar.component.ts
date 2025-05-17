import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agency-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './agency-sidebar.component.html',
  styleUrl: './agency-sidebar.component.css'
})
export class AgencySidebarComponent {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
