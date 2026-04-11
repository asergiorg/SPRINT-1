import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activity1 } from './activity1';

describe('Activity1', () => {
  let component: Activity1;
  let fixture: ComponentFixture<Activity1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activity1],
    }).compileComponents();

    fixture = TestBed.createComponent(Activity1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
