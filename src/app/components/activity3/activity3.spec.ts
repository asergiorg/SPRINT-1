import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Activity3 } from './activity3';

describe('Activity3', () => {
  let component: Activity3;
  let fixture: ComponentFixture<Activity3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Activity3],
    }).compileComponents();

    fixture = TestBed.createComponent(Activity3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
