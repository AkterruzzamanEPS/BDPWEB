import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTransportComponent } from './find-transport.component';

describe('FindTransportComponent', () => {
  let component: FindTransportComponent;
  let fixture: ComponentFixture<FindTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindTransportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
