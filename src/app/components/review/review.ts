import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review implements OnInit {
  @Input() imageUrl: string = '';
  @Input() username: string = '';
  @Input() rating: number = 0;
  @Input() comment: string = '';

  @ViewChild('commentBox', { static: true }) commentBox!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('counter', { static: true }) counter!: ElementRef<HTMLDivElement>;

  currentRating: number = 0;
  stars: HTMLElement[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initializeStars();
    this.updateCounterDisplay();
  }

  private initializeStars(): void {
    // Las estrellas se manejan en el template con (click)
  }

  selectStar(rating: number): void {
    if (this.currentRating === rating) {
      this.currentRating = 0;
    } else {
      this.currentRating = rating;
    }
    this.updateStarsDisplay();
  }

  private updateStarsDisplay(): void {
    // Actualizar visualmente las estrellas (se hace en el template con [class.filled])
  }

  updateCounter(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const currentLength = target.value.length;
    const maxLength = parseInt(target.getAttribute('maxlength') || '500', 10);

    if (this.counter) {
      this.renderer.setProperty(this.counter.nativeElement, 'textContent', `${currentLength} / ${maxLength}`);

      if (currentLength >= maxLength * 0.9) {
        this.renderer.addClass(this.counter.nativeElement, 'limit-reached');
      } else {
        this.renderer.removeClass(this.counter.nativeElement, 'limit-reached');
      }
    }
  }

  private updateCounterDisplay(): void {
    if (this.counter) {
      this.renderer.setProperty(this.counter.nativeElement, 'textContent', `0 / 500`);
    }
  }

  submitReview(): void {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (!currentUser) {
      alert("Debes iniciar sesión para publicar una reseña.");
      return;
    }

    const comment = this.commentBox.nativeElement.value.trim();

    if (!comment || this.currentRating === 0) {
      alert("Por favor, escribe un comentario y selecciona una puntuación.");
      return;
    }

    // Recuperar lista de reviews
    const stored = sessionStorage.getItem("reviews");
    const reviews = stored ? JSON.parse(stored) : [];
    const activity_id = localStorage.getItem("selectedActivityId");

    // Crear nueva review
    const newReview = {
      activity_id: activity_id,
      user: currentUser,
      body: comment,
      rating: this.currentRating
    };

    // Añadir y guardar
    reviews.push(newReview);
    sessionStorage.setItem("reviews", JSON.stringify(reviews));

    // Reset
    this.commentBox.nativeElement.value = "";
    this.currentRating = 0;
    this.updateStarsDisplay();
    this.updateCounterDisplay();

    // Recargar página (o emitir evento)
    location.reload();
  }
}
