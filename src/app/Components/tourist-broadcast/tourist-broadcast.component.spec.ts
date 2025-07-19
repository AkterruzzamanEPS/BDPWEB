import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristBroadcastComponent } from './tourist-broadcast.component';

describe('TouristBroadcastComponent', () => {
  let component: TouristBroadcastComponent;
  let fixture: ComponentFixture<TouristBroadcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristBroadcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
