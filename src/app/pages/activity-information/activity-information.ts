import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { Review } from '../../components/review/review';
import { Activity } from '../../models/activity.model';
import { ActivitiesDatabaseService } from '../../services/activities';
import { ReviewsService } from '../../services/reviews';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../models/reservation.model';
import { ReservationState } from '../../services/reservation-state';

export interface ReviewData {
  reviewId?: string;
  activity: string;
  reviewer: string;
  rating: number;
  comment: string;
}

export type NewReservation = Omit<Reservation, 'id'>

@Component({
  selector: 'app-activity-information',
  standalone: true,
  imports: [Review, FormsModule],
  templateUrl: './activity-information.html',
  styleUrl: './activity-information.css',
})
export class ActivityInformation implements OnInit {
  reviews!: ReviewData[];
  activity!: Activity;
  private route = inject(ActivatedRoute);
  private activitiesService = inject(ActivitiesDatabaseService);
  private reviewService = inject(ReviewsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private location = inject(Location);

  private stateService = inject(ReservationState);

  // --- VARIABLES DEL CALENDARIO ---
  currentDate: Date = new Date();
  monthNames: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  weekDays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  daysInMonth: number[] = [];
  blankDays: number[] = [];
  
  // Variable para guardar el día que el usuario ha elegido
  selectedDate: Date | null = null;
  selectedHour: string = "";
  
  // Variables del estado de la reserva
  participants = 1;

  // Variables para controlar el estado del formulario de la reseña
  currentRating: number = 0;
  newComment: string = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.activitiesService.getById(id).subscribe({
        next: (datos) => {
          this.activity = datos;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando detalles', err)
      });
      this.reviewService.getAll().subscribe({
        next: (todasLasResenas) => {
          this.reviews = todasLasResenas.filter(resena => String(resena.activity) === String(id));
          
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando reviews', err)
      });
      const reservationModified = this.stateService.reservation();
      if (reservationModified && reservationModified.activityId == id) {
        const fechaLimpia = reservationModified.date.replace(/-/g, '\/'); 
        this.selectedDate = new Date(fechaLimpia);
        this.selectedHour = reservationModified.time;
        this.participants = reservationModified.participants;
      }
      this.generateCalendar();
    }

  }

  setRating(rating: number) {
    this.currentRating = rating;
  }

  submitReview() {
    if (this.currentRating === 0) {
      alert('Por favor, selecciona una puntuación con las estrellas.');
      return;
    }
    
    if (this.newComment.trim() === '') {
      alert('Por favor, escribe un comentario antes de enviar.');
      return;
    }

    const newReview: ReviewData = {
      reviewer: 'Usuario Actual', // Aquí va el nombre del usuario logueado
      activity: this.activity.id,
      rating: this.currentRating,
      comment: this.newComment
    };


    this.reviewService.save(newReview).subscribe({
      next: (reseniaGuardadaDesdeElServidor) => {
        this.reviews.unshift(reseniaGuardadaDesdeElServidor); 
        
        this.currentRating = 0;
        this.newComment = '';

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al guardar en la base de datos', err);
        alert('Hubo un error al guardar tu reseña.');
      }
    });

    this.currentRating = 0;
    this.newComment = '';
  }

  // --- FUNCIONES DEL CALENDARIO ---
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const numDays = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: numDays }, (_, i) => i + 1);

    const firstDayIndex = new Date(year, month, 1).getDay();
    
    const startingDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    this.blankDays = Array(startingDayOffset).fill(0);
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  selectDate(day: number) {
    if (this.isPastDate(day)) {
        return; 
    }

    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return this.selectedDate.getDate() === day &&
           this.selectedDate.getMonth() === this.currentDate.getMonth() &&
           this.selectedDate.getFullYear() === this.currentDate.getFullYear();
  }

  isPastDate(day: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateToCheck = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);

    return dateToCheck < today;
  } 
  
  // ------------------ FUNCIONES PARTICIPANTES ----------------------
  increaseParticipants(): void {
    if(this.participants < 20) this.participants += 1;
  }
  
  decreaseParticipants(): void {
    if(this.participants > 1) this.participants -= 1;
  }
  
  // -------------------- FUNCIONES HORAS ------------------------
  selectHour(hour: string): void {
    this.selectedHour = hour;
  }
  
  isSelectedHour(hour:string): boolean {
    return this.selectedHour == hour;
  }
  
  // ---------------------- FUNCIONES RESERVA ---------------------
  makeReservation(): void {
    if(!this.selectedDate){
      alert("You have not selected any date.")
      return;
    } 
    const date =  formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US')
    if(!this.selectedHour) {
      alert("You have not selected any hour.")
      return;
    }
    const reservation: Reservation ={
      "id": this.getId(),
      "type": "reservation",
      "activity": this.activity.name,
      "date": date,
      "time": this.selectedHour, 
      "participants": this.participants,
      "holder": "Jhon Doe",
      "status": this.getStatus(),
      "price": this.calculatePrice(),
      "totalToPay": this.calculateAmount(),
      "activityId": this.activity.id
    }
    this.stateService.clearState();
    this.stateService.reservation.set(reservation);
    this.router.navigate(['/reservation-information', reservation.id]);
  }

  getStatus(): "Pending" | "Paid" | "Confirmed" | "Cancelled" {
    return (this.calculateAmount() > 0) ? "Pending" : "Paid";
  }

  calculatePrice():number {
    return this.activity.price * this.participants;
  }

  calculateAmount(): number {
    const reservation = this.stateService.reservation();
    const amount = (reservation) ? (this.calculatePrice() - reservation.price) : this.calculatePrice();
    return (amount > 0) ? amount : 0;
  }

  getId(): string {
    const reservation = this.stateService.reservation();
    return (reservation) ? reservation.id : 'new';
  }

  // Panel desplazable
  isPanelOpen: boolean = false;

  toggleReservationPanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }
}
