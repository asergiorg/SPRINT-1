import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesCatalog } from './activities-catalog';

describe('ActivitiesCatalog', () => {
  let component: ActivitiesCatalog;
  let fixture: ComponentFixture<ActivitiesCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiesCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
