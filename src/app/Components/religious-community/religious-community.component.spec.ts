import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReligiousCommunityComponent } from './religious-community.component';

describe('ReligiousCommunityComponent', () => {
  let component: ReligiousCommunityComponent;
  let fixture: ComponentFixture<ReligiousCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReligiousCommunityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReligiousCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
