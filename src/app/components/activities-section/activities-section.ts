import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationCard } from '../reservation-card/reservation-card';
import { Activity3 } from '../activity-3/activity-3';
import { Reservation } from '../../models/reservation.model';
import { Activity } from '../../models/activity.model';

export type Cards = Reservation | Activity;

@Component({
  selector: 'app-activities-section',
  standalone: true,
  imports: [ReservationCard, Activity3, RouterLink],
  templateUrl: './activities-section.html',
  styleUrl: './activities-section.css',
})

export class ActivitiesSection {
  @Input() title: string = '';
  @Input() cards: Cards[] = [];

  // -- CONFIGURACIÓN DE LA VISTA --
  readonly INITIAL_VIEW_COUNT = 5; // Cuántas cards mostrar al principio o al colapsar
  readonly VIEW_MORE_STEP = 5;     // Cuántas cards añadir cada vez que das a "View More"

  // Esta es la variable que usa el slice() en tu HTML
  viewCount: number = this.INITIAL_VIEW_COUNT;

  // -- LÓGICA DE LOS BOTONES --
  incrementView(): void {
    // Aumentamos el contador, pero asegurándonos de no sobrepasar la longitud total del array
    this.viewCount = Math.min(this.viewCount + this.VIEW_MORE_STEP, this.cards.length);
  }

  reduceView(): void {
    // Reiniciamos el contador al mínimo
    this.viewCount = this.INITIAL_VIEW_COUNT;
  }
}
