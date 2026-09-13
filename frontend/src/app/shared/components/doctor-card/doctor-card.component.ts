import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../../core/models/doctor.model';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule, RatingStarsComponent],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css'
})
export class DoctorCardComponent {
  @Input({ required: true }) doctor!: Doctor;
  @Output() book = new EventEmitter<Doctor>();
  @Output() viewProfile = new EventEmitter<Doctor>();

  get doctorName(): string {
    if (typeof this.doctor.userId === 'object' && this.doctor.userId !== null) {
      return `Dr. ${(this.doctor.userId as any).firstName} ${(this.doctor.userId as any).lastName}`;
    }
    return 'Dr. Specialist';
  }
}
