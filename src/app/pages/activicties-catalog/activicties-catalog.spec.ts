import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivictiesCatalog } from './activicties-catalog';

describe('ActivictiesCatalog', () => {
  let component: ActivictiesCatalog;
  let fixture: ComponentFixture<ActivictiesCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivictiesCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivictiesCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
