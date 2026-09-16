import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);

  submitting = false;
  errorMessage = '';

  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    date: ['', [Validators.required]],
    location: ['', [Validators.required]],
    category: ['', [Validators.required]],
    capacity: [1, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  get f() {
    return this.eventForm.controls;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    // Read the current values directly from the form instance.
    const newEvent = this.eventForm.getRawValue();

    this.eventService.addEvent(newEvent as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = 'Failed to add the event. Please try again.';
        console.error(err);
      }
    });
  }
}
