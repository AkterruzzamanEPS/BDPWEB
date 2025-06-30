import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristZoneComponent } from './tourist-zone.component';

describe('TouristZoneComponent', () => {
  let component: TouristZoneComponent;
  let fixture: ComponentFixture<TouristZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristZoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
