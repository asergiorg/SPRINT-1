import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../models/reservation.model';
import { Location } from '@angular/common';
import { ReservationState } from '../../services/reservation-state.service';

export interface PaymentMethod {
  text: string;
}

@Component({
  selector: 'app-reservation-information',
  imports: [],
  templateUrl: './reservation-information.html',
  styleUrl: './reservation-information.css',
})
export class ReservationInformation implements OnInit {
  private route = inject(ActivatedRoute);
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private location = inject(Location);
  private stateService = inject(ReservationState);

  reservation!: Reservation;
  googlePay: PaymentMethod = { text: 'Google Pay' };
  masterCard: PaymentMethod = { text: 'MasterCard' };
  visa: PaymentMethod = { text: 'Visa' };
  applePay: PaymentMethod = { text: 'Apple Pay' };

  isProcessing: boolean = false;
  reservationMade = this.stateService.reservation();
  id = this.route.snapshot.paramMap.get('id');

  ngOnInit(): void {
    if (this.reservationMade) {
      this.reservation = this.reservationMade;
    } else if (this.id) {
      this.reservationService.getReservationById(this.id).subscribe({
        next: (datos) => {
          this.reservation = datos;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando detalles', err),
      });
    }
  }

  applyPaymentMethod(method: PaymentMethod): void {
    if (!this.isProcessing) {
      method.text = 'Procesando...';
      this.cdr.detectChanges();
      this.modifyStatus();
    }
  }

  async modifyStatus(): Promise<void> {
    if (!this.reservation) return;

    this.isProcessing = true;
    this.cdr.detectChanges();

    if (this.reservationMade) {
      setTimeout(() => {
        this.reservation.status = 'Paid';
        this.isProcessing = false;
        this.cdr.detectChanges();
      }, 2000);
    } else {
      setTimeout(async () => {
        this.reservation.status = 'Paid';

        try {
          await this.reservationService.updateReservation(this.reservation.id, this.reservation);

          this.isProcessing = false;
          this.cdr.detectChanges();
          console.log('Pago procesado y reserva guardada con éxito en Firebase');
        } catch (err) {
          console.error('Error al guardar en Firebase', err);
          this.reservation.status = 'Pending';
          this.isProcessing = false;
          this.cdr.detectChanges();
        }
      }, 2000);
    }
  }

  async cancelReservation(): Promise<void> {
    if (this.reservationMade) {
      this.stateService.clearState();
      this.location.back();
    } else {
      try {
        await this.reservationService.deleteReservation(this.reservation.id);

        this.stateService.clearState();
        console.log('Reserva cancelada');
        this.location.back();
      } catch (err) {
        console.error('Error cancelando en Firebase', err);
      }
    }
  }

  async confirmReservation(): Promise<void> {
    this.reservation.status = 'Confirmed';

    try {
      if (this.id === 'new') {
        await this.reservationService.addReservation(this.reservation);
      } else {
        await this.reservationService.updateReservation(this.reservation.id, this.reservation);
      }

      console.log('Reserva confirmada');
      this.stateService.clearState();
      this.router.navigate(['/user-activities']);
    } catch (err) {
      console.error('Error confirmando en Firebase', err);
    }
  }

  modifyReservation(): void {
    this.stateService.clearState();
    this.stateService.reservation.set(this.reservation);
    this.router.navigate(['/activity-information', this.reservation.activityId]);
  }
}
