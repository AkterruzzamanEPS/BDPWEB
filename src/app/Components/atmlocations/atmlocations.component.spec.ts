import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ATMLocationsComponent } from './atmlocations.component';

describe('ATMLocationsComponent', () => {
  let component: ATMLocationsComponent;
  let fixture: ComponentFixture<ATMLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ATMLocationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ATMLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
