import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AgencyService } from '../../../../core/services/agency.service';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';

// Interface pour une agence
export interface Agency {
  id: number;
  name: string;
  address: string;
  phone: string;
  city: {
    id: number;
    name: string;
  };
  photoUrl: string;
}

@Component({
  selector: 'app-agencies-list',
  templateUrl: './agencies-list.component.html',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  providers: [AgencyService]
})
export class AgenciesListComponent implements OnInit {
  agencies: Agency[] = []; // قائمة الوكالات
  showModal = false; // للتحكم في ظهور النافذة المنبثقة
  modalType: 'login' | '' = ''; // نوع النافذة
  modalMessage = ''; // رسالة النافذة
redirectTo: string = '';

  constructor(
    private agencyService: AgencyService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAgencies();
  }

  // تحميل قائمة الوكالات
  loadAgencies() {
    this.agencyService.getAllAgencies().subscribe((data: Agency[]) => {
      this.agencies = data;
    });
  }

  // التعامل مع النقر على زر "Obtenir un ticket"
  handleTicketClick(): void {
    if (!this.authService.isAuthenticated()) {
      // إذا لم يكن المستخدم مسجلاً الدخول
      this.modalMessage = 'Veuillez vous connecter pour obtenir un ticket.';
      this.modalType = 'login';
      this.showModal = true;
      this.redirectTo = '/ticket-wizard';
    } else {
      // إذا كان المستخدم مسجلاً الدخول
      this.router.navigate(['/ticket-wizard']);
    }
  }

  // إغلاق النافذة المنبثقة
  closeModal(): void {
    this.showModal = false;
    this.modalType = '';
    this.modalMessage = '';
  }

// التوجيه إلى صفحة تسجيل الدخول مع تمرير redirectTo
goToLogin(): void {
  this.showModal = false;
  this.router.navigate(['/auth/login'], { queryParams: { redirectTo: this.redirectTo } });
}
}