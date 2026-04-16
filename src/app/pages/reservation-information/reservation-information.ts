import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ReservationsDatabaseService } from '../../services/reservations';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../../models/reservation.model';
import { Location } from '@angular/common';
import { ReservationState } from '../../services/reservation-state';

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
  private reservationService = inject(ReservationsDatabaseService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private location = inject(Location);
  private stateService = inject(ReservationState)
  
  reservation!: Reservation;
  googlePay: PaymentMethod = { text: 'Google Pay' };
  masterCard: PaymentMethod = { text: 'MasterCard' };
  visa: PaymentMethod = { text: 'Visa' };
  applePay: PaymentMethod = { text: 'Apple Pay' };
  
  isProcessing: boolean = false; 
  private reservationMade = this.stateService.reservation();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id == 'new'){
      this.reservation = this.reservationMade;
    } else if (id) {
      this.reservationService.getById(id).subscribe({
        next: (datos) => {
          this.reservation = datos;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando detalles', err)
      });
    }
    
  }

  applyPaymentMethod(method: PaymentMethod): void {
    if(!this.isProcessing) {
      method.text = 'Procesando...';
      this.cdr.detectChanges();
      this.modifyStatus();
    }
  }

  modifyStatus(): void {
    if (!this.reservation) return;

    this.isProcessing = true;
    this.cdr.detectChanges();

    if(this.reservationMade){
      setTimeout(() => { 
        this.reservation.status = 'Paid';
        this.isProcessing = false;
        this.cdr.detectChanges();
      }, 2000);
    } else {
      setTimeout(() => {
        this.reservation.status = 'Paid'; 
  
        this.reservationService.update(this.reservation.id, this.reservation).subscribe({
          next: (res) => {
            this.isProcessing = false;
            this.cdr.detectChanges();
            
            console.log('Pago procesado y reserva guardada con éxito', res);
          },
          error: (err) => {
            console.error('Error al guardar en el servidor', err);
            this.reservation.status = 'Pending';
            this.isProcessing = false;
            this.cdr.detectChanges();
          }
        });
      }, 2000);
    }
  }

  cancelReservation(): void {
    if(this.reservationMade){
      this.stateService.clearState();
    } else {
      this.reservationService.delete(this.reservation.id).subscribe({
        next: () => {
          this.stateService.clearState();
          console.log('Reserva cancelada');
          this.location.back();
        },
        error: (err) => console.error('Error cancelando', err)
      });
    }
  }

  confirmReservation(): void {
    this.reservation.status = 'Confirmed';
    if(this.reservationMade){
      this.reservationService.save(this.reservation).subscribe({
        next: () => {
          console.log('Reserva confirmada');
          this.stateService.clearState();
          this.router.navigate(['/user-activities']);
        },
        error: (err) => console.error('Error confirmando', err)
      });
    } else {
      this.reservationService.update(this.reservation.id, this.reservation).subscribe({
        next: () => {
          console.log('Reserva confirmada');
          this.stateService.clearState();
          this.router.navigate(['/user-activities']);
        },
        error: (err) => console.error('Error confirmando', err)
      });
    }
  }

}