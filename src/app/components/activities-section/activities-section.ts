import { Component, Input, ElementRef, OnInit, OnDestroy, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationCard } from '../reservation-card/reservation-card';
import { Activity3 } from '../activity3/activity3';
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
export class ActivitiesSection implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() cards: Cards[] = [];

  initialViewCount: number = 5;
  viewMoreStep = 5;

  viewCount: number = this.initialViewCount;

  private resizeObserver!: ResizeObserver;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.resizeObserver = new ResizeObserver(entries => {
        this.ngZone.run(() => {
          const width = entries[0].contentRect.width;
          this.updateCardCountBasedOnWidth(width);
        });
      });

      this.resizeObserver.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  updateCardCountBasedOnWidth(width: number): void {
    let newInitialCount: number;

    if (width < 400) {
      newInitialCount = 1;
    } else if (width < 600) {
      newInitialCount = 2;
    } else if (width < 900) {
      newInitialCount = 3;
    } else if (width < 1200) {
      newInitialCount = 4;
    } else {
      newInitialCount = 5;
    }

    this.viewMoreStep = newInitialCount;

    if (this.viewCount === this.initialViewCount || this.viewCount < newInitialCount) {
      this.viewCount = newInitialCount;
    }

    this.initialViewCount = newInitialCount;
  }

  incrementView(): void {
    this.viewCount = Math.min(this.viewCount + this.viewMoreStep, this.cards.length);
  }

  reduceView(): void {
    this.viewCount = this.initialViewCount;
  }
}
