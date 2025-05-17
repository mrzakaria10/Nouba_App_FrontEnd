import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencySidebarComponent } from './agency-sidebar.component';

describe('AgencySidebarComponent', () => {
  let component: AgencySidebarComponent;
  let fixture: ComponentFixture<AgencySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencySidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgencySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
