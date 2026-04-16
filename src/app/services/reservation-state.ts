import { Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationState {
  reservation = signal<any>(null);

  clearState() {
    this.reservation.set(null);
  }
}
