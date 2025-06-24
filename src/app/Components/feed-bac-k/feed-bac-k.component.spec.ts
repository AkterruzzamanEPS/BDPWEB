import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBacKComponent } from './feed-bac-k.component';

describe('FeedBacKComponent', () => {
  let component: FeedBacKComponent;
  let fixture: ComponentFixture<FeedBacKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedBacKComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedBacKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
