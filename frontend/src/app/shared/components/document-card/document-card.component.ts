import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalDocument } from '../../../core/models/document.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { FileTypePipe } from '../../pipes/file-type.pipe';

@Component({
  selector: 'app-document-card',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, FileTypePipe],
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.css'
})
export class DocumentCardComponent {
  @Input({ required: true }) document!: MedicalDocument;
  @Output() view = new EventEmitter<MedicalDocument>();
  @Output() delete = new EventEmitter<MedicalDocument>();
}
