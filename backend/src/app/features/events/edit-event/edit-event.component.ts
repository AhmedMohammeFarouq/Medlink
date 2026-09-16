import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  eventId: string | null = null;
  loading = true;
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

  ngOnInit(): void {
    // 1. Get the event ID from the route.
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (!this.eventId) {
      this.errorMessage = 'No event id provided.';
      this.loading = false;
      return;
    }

    // 2. Get the existing event from the API.
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        // 3. Fill the Reactive Form using the received data.
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          date: this.toDateInputValue(event.date),
          location: event.location,
          category: event.category,
          capacity: event.capacity,
          price: event.price
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load the event.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid || !this.eventId) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    // 5. Get the new values from the form (raw value, never hard-coded).
    const updatedEvent = this.eventForm.getRawValue();

    // 6. Send the updated data using PUT.
    this.eventService.updateEvent(this.eventId, updatedEvent as any).subscribe({
      next: () => {
        this.submitting = false;
        // 7. Navigate back to the Events page after success.
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = 'Failed to update the event. Please try again.';
        console.error(err);
      }
    });
  }

  /** Converts an ISO date/datetime string to the yyyy-MM-dd format the date input expects. */
  private toDateInputValue(date: string): string {
    if (!date) {
      return '';
    }
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return date;
    }
    return parsed.toISOString().slice(0, 10);
  }
}
