import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecord } from '../../../core/models/medical-record.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';

@Component({
  selector: 'app-medical-record-card',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, StatusLabelPipe],
  templateUrl: './medical-record-card.component.html',
  styleUrl: './medical-record-card.component.css'
})
export class MedicalRecordCardComponent {
  @Input({ required: true }) record!: MedicalRecord;
  @Output() view = new EventEmitter<MedicalRecord>();
}
