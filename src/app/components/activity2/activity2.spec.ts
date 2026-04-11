import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activity2 } from './activity2';

describe('Activity2', () => {
  let component: Activity2;
  let fixture: ComponentFixture<Activity2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activity2],
    }).compileComponents();

    fixture = TestBed.createComponent(Activity2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
