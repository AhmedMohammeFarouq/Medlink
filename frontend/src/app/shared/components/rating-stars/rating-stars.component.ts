import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css'
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() max: number = 5;
  // When true, renders as a clickable input control (e.g. for a review form)
  // instead of a read-only display of an existing rating.
  @Input() interactive: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating = 0;

  get stars(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

  get displayRating(): number {
    return this.interactive && this.hoverRating > 0 ? this.hoverRating : this.rating;
  }

  selectStar(star: number): void {
    if (!this.interactive) return;
    this.rating = star;
    this.ratingChange.emit(star);
  }

  onStarHover(star: number): void {
    if (!this.interactive) return;
    this.hoverRating = star;
  }

  onMouseLeave(): void {
    if (!this.interactive) return;
    this.hoverRating = 0;
  }
}
