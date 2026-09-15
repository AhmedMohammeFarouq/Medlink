import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.css'
})
export class ErrorStateComponent {
  @Input() title: string = 'Something Went Wrong';
  @Input() message: string = 'We could not complete your request. Please try again.';
  @Input() retryText: string = 'Try Again';
  @Output() retry = new EventEmitter<void>();
}
