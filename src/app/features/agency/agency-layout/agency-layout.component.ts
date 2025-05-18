import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgencySidebarComponent } from '../agency-sidebar/agency-sidebar.component';

@Component({
  selector: 'app-agency-layout',
  standalone: true,
  imports: [AgencySidebarComponent, RouterOutlet],
  template: `
    <div class="flex h-screen">
      <app-agency-sidebar></app-agency-sidebar>
      <main class="flex-1 bg-gray-50 p-6 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AgencyLayoutComponent {}
