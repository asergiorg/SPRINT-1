import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivitiesDatabaseService } from '../../services/activities';
import { ReservationsDatabaseService } from '../../services/reservations';
import { forkJoin } from 'rxjs'; 

import { Activity } from '../../models/activity.model';
import { Reservation } from '../../models/reservation.model';
import { ActivitiesSection } from '../../components/activities-section/activities-section';

export interface Section {
  key: string;
  items: (Activity | Reservation)[];
}

@Component({
  selector: 'app-user-activities',
  standalone: true,
  imports: [ActivitiesSection],
  templateUrl: './user-activities.html',
  styleUrl: './user-activities.css'
})
export class UserActivities implements OnInit {
  private activitiesService = inject(ActivitiesDatabaseService);
  private reservationsService = inject(ReservationsDatabaseService);

  sections = signal<Section[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      reservas: this.reservationsService.getAll(),
      actividades: this.activitiesService.getAll()
    }).subscribe({
      next: (datos) => {
        this.sections.set([
          { key: 'Reserved Activities', items: datos.reservas },
          { key: 'Attended Activities', items: datos.actividades },
          { key: 'Recommended Activities', items: datos.actividades }
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando la base de datos:', err);
        this.isLoading.set(false);
      }
    });
  }
}