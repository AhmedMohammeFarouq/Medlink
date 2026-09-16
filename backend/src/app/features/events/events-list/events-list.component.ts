import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, catchError, of } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { EventModel } from '../../../core/models/event.model';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent {
  private eventService = inject(EventService);

  // Incrementing this subject triggers a fresh HTTP request, letting the
  // template stay driven by the async pipe (no manual subscribe/mutate).
  private refresh$ = new BehaviorSubject<void>(undefined);

  errorMessage = '';
  deletingId: string | number | null = null;

  events$: Observable<EventModel[]> = this.refresh$.pipe(
    switchMap(() =>
      this.eventService.getEvents().pipe(
        catchError((err) => {
          this.errorMessage = 'Failed to load events. Please try again later.';
          console.error(err);
          return of([] as EventModel[]);
        })
      )
    )
  );

  deleteEvent(event: EventModel): void {
    if (!event.id) {
      return;
    }
    const confirmed = confirm(`Delete "${event.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.deletingId = event.id;
    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.refresh$.next(); // refresh the list after successful deletion
      },
      error: (err) => {
        this.deletingId = null;
        this.errorMessage = 'Failed to delete the event. Please try again.';
        console.error(err);
      }
    });
  }
}
