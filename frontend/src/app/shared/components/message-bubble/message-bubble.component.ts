import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../core/models/message.model';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.css'
})
export class MessageBubbleComponent {
  @Input({ required: true }) message!: ChatMessage;
  @Input() isMe: boolean = false;
}
