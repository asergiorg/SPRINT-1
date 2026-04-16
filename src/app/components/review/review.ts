import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  imports: [CommonModule],
  templateUrl: './review.html',
  styleUrl: './review.css',
})
export class Review {
  @Input() imageUrl: string = '';
  @Input() username: string = '';
  @Input() rating: number = 0;
  @Input() comment: string = '';
}
