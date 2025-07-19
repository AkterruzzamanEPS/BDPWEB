import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceBroadcastComponent } from './police-broadcast.component';

describe('PoliceBroadcastComponent', () => {
  let component: PoliceBroadcastComponent;
  let fixture: ComponentFixture<PoliceBroadcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliceBroadcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliceBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
