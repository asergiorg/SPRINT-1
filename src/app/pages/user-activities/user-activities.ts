import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivitiesDatabaseService } from '../../services/activities';
import { ReservationsDatabaseService } from '../../services/reservations';
import { forkJoin } from 'rxjs'; 

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
  
  private activitiesService = inject(ActivitiesDatabaseService);
  private reservationsService = inject(ReservationsDatabaseService);
  private cdr = inject(ChangeDetectorRef);

  // Volvemos a tu estructura original de secciones, empezando vacía
  sections: Section[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Lanzamos ambas peticiones en paralelo
    forkJoin({
      reservas: this.reservationsService.getAll(),
      actividades: this.activitiesService.getAll()
    }).subscribe({
      next: (datos) => {
        // Cuando ambas terminan, construimos el array que tu HTML ya sabe pintar
        this.sections = [
          {
            key: 'Reserved Activities',
            items: datos.reservas
          },
          {
            key: 'Attended Activities',
            // Opcional: Podrías filtrar aquí si quisieras separar las actividades
            items: datos.actividades 
          },
          {
            key: 'Recommended Activities',
            items: datos.actividades 
          }
        ];
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando la base de datos:', err);
        this.isLoading = false;
      }
    });
  }
}