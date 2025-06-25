import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyRidesComponent } from './nearby-rides.component';

describe('NearbyRidesComponent', () => {
  let component: NearbyRidesComponent;
  let fixture: ComponentFixture<NearbyRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyRidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbyRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
