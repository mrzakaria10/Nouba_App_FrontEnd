import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyCompteComponent } from './agency-compte.component';

describe('AgencyCompteComponent', () => {
  let component: AgencyCompteComponent;
  let fixture: ComponentFixture<AgencyCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyCompteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgencyCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
