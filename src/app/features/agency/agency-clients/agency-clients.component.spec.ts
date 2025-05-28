import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyClientsComponent } from './agency-clients.component';

describe('AgencyClientsComponent', () => {
  let component: AgencyClientsComponent;
  let fixture: ComponentFixture<AgencyClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyClientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgencyClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
