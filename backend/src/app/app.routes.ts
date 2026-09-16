import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Login must remain accessible at all times -> no guard here.
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent)
  },

  // Protected routes: each is lazy-loaded only when the user navigates to it.
  {
    path: 'events',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/events/events-list/events-list.component').then(
        (m) => m.EventsListComponent
      )
  },
  {
    path: 'events/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/events/event-details/event-details.component').then(
        (m) => m.EventDetailsComponent
      )
  },
  {
    path: 'add-event',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/events/add-event/add-event.component').then(
        (m) => m.AddEventComponent
      )
  },
  {
    path: 'edit-event/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/events/edit-event/edit-event.component').then(
        (m) => m.EditEventComponent
      )
  },

  { path: '**', redirectTo: 'login' }
];
