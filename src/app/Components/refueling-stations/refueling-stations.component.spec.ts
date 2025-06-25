import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefuelingStationsComponent } from './refueling-stations.component';

describe('RefuelingStationsComponent', () => {
  let component: RefuelingStationsComponent;
  let fixture: ComponentFixture<RefuelingStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefuelingStationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefuelingStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
