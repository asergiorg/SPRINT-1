import { Component, Input } from '@angular/core';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-card',
  imports: [],
  templateUrl: './reservation-card.html',
  styleUrl: './reservation-card.css',
})
export class ReservationCard {
  @Input() reservation!: Reservation;
}
