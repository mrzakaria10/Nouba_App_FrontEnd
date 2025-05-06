import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketWizardComponent } from './ticket-wizard.component';

describe('TicketWizardComponent', () => {
  let component: TicketWizardComponent;
  let fixture: ComponentFixture<TicketWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketWizardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
