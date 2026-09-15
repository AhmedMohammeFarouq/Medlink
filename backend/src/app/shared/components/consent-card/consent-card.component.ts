import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsentRequest } from '../../../core/models/consent.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-consent-card',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  templateUrl: './consent-card.component.html',
  styleUrl: './consent-card.component.css'
})
export class ConsentCardComponent {
  @Input({ required: true }) consent!: ConsentRequest;
  @Output() grant = new EventEmitter<ConsentRequest>();
  @Output() revoke = new EventEmitter<ConsentRequest>();
}
