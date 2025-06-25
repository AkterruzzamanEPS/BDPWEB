import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedMarkedSpotsComponent } from './red-marked-spots.component';

describe('RedMarkedSpotsComponent', () => {
  let component: RedMarkedSpotsComponent;
  let fixture: ComponentFixture<RedMarkedSpotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedMarkedSpotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedMarkedSpotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
