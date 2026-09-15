import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prescription } from '../../../core/models/prescription.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-prescription-card',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  templateUrl: './prescription-card.component.html',
  styleUrl: './prescription-card.component.css'
})
export class PrescriptionCardComponent {
  @Input({ required: true }) prescription!: Prescription;
  @Output() print = new EventEmitter<Prescription>();
}
