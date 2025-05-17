import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDashboardComponent } from './agency-dashboard.component';

describe('AgencyDashboardComponent', () => {
  let component: AgencyDashboardComponent;
  let fixture: ComponentFixture<AgencyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgencyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
