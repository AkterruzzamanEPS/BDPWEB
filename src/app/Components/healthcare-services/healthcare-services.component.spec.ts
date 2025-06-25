import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareServicesComponent } from './healthcare-services.component';

describe('HealthcareServicesComponent', () => {
  let component: HealthcareServicesComponent;
  let fixture: ComponentFixture<HealthcareServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthcareServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
