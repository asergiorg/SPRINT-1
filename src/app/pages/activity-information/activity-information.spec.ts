import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInformation } from './activity-information';

describe('ActivityInformation', () => {
  let component: ActivityInformation;
  let fixture: ComponentFixture<ActivityInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
