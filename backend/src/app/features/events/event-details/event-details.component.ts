import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable, switchMap, catchError, of, map } from 'rxjs';
import { EventService } from '../../../core/services/event.service';
import { EventModel } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);

  errorMessage = '';

  event$: Observable<EventModel | null> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => {
      if (!id) {
        this.errorMessage = 'No event id provided.';
        return of(null);
      }
      return this.eventService.getEventById(id).pipe(
        catchError((err) => {
          this.errorMessage = 'Failed to load event details.';
          console.error(err);
          return of(null);
        })
      );
    })
  );
}
