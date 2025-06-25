import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDineComponent } from './food-dine.component';

describe('FoodDineComponent', () => {
  let component: FoodDineComponent;
  let fixture: ComponentFixture<FoodDineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodDineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodDineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
