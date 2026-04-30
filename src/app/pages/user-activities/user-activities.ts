import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivityService } from '../../services/activities';
import { ReservationService } from '../../services/reservations';
import { combineLatest } from 'rxjs';

import { Activity } from '../../models/activity.model';
import { Reservation } from '../../models/reservation.model';
import { ActivitiesSection } from '../../components/activities-section/activities-section';
import { Header } from '../../components/header/header';

export interface Section {
  key: string;
  items: (Activity | Reservation)[];
}
@Component({
  selector: 'app-user-activities',
  standalone: true,
  imports: [Header, ActivitiesSection],
  templateUrl: './user-activities.html',
  styleUrl: './user-activities.css',
})
export class UserActivities implements OnInit {

  private activitiesService = inject(ActivityService);
  private reservationsService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);

  sections: Section[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    combineLatest({
      actividades: this.activitiesService.getActivities(),
      reservas: this.reservationsService.getReservations(),
    }).subscribe({
      next: (datos) => {
        const reservasConTipo = datos.reservas.map((r: Reservation) => ({ ...r, type: 'reservation' }));
        const actividadesConTipo = datos.actividades.map((a: Activity) => ({ ...a, type: 'activity' }));

        this.sections = [
          {
            key: 'Reserved Activities',
            items: reservasConTipo,
          },
          {
            key: 'Attended Activities',
            items: actividadesConTipo,
          },
          {
            key: 'Recommended Activities',
            items: actividadesConTipo,
          },
        ];
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando la base de datos:', err);
        this.isLoading = false;
      },
    });
  }
}
