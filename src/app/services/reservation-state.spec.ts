import { TestBed } from '@angular/core/testing';

import { ReservationState } from './reservation-state';

describe('ReservationState', () => {
  let service: ReservationState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
