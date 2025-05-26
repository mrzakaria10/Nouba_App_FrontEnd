import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyHistoryComponent } from './agency-history.component';

describe('AgencyHistoryComponent', () => {
  let component: AgencyHistoryComponent;
  let fixture: ComponentFixture<AgencyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgencyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
