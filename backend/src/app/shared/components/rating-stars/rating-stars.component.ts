import { Component, Input } from '@angular/core';
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

  get stars(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }
}
