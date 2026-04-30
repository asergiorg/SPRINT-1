import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  @Input() imageUrl: string = 'assets/avatar.jpg';
  @Input() username: string = '';
  @Input() rating: number = 0;
  @Input() comment: string = '';
  @Input() photos: string[] = [];

  selectedModalPhoto: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  openImage(photoUrl: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.selectedModalPhoto = photoUrl;
      const modalElement = document.getElementById('imageModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }
}
