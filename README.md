# Event Management System (Angular)

A complete Angular practice solution covering Routing, Lazy Loading, Reactive Forms,
Guards, Interceptors, HttpClient/Observables, and Authentication with refresh tokens.

## 1. Setup

This canvas contains only the source files (no `node_modules`, since this environment
has no network/npm access). To run it:

```bash
npm install -g @angular/cli@18
mkdir my-app && cd my-app
ng new event-management-system --standalone --routing=false --style=css
# When prompted, you can say no to SSR.
```

Then copy the contents of this project's `src/`, `angular.json`, `package.json`,
`tsconfig.json`, and `tsconfig.app.json` into the generated project, overwriting the
defaults. After that:

```bash
npm install
ng serve
```

Set your real backend URL in `src/environments/environment.ts` (`apiUrl`).

## 2. Expected backend API

| Method | Endpoint              | Purpose                              |
|--------|------------------------|---------------------------------------|
| POST   | /auth/login            | `{ email, password }` → `{ accessToken, refreshToken }` |
| POST   | /auth/refresh           | `{ refreshToken }` → `{ accessToken, refreshToken? }` |
| GET    | /events                 | List all events |
| GET    | /events/:id             | Get one event |
| POST   | /events                 | Create event |
| PUT    | /events/:id             | Update event |
| DELETE | /events/:id             | Delete event |

## 3. How each requirement is implemented

| Concept | Where |
|---|---|
| Login page | `features/login/login.component.*` — Reactive Form (email, password) |
| AuthService | `core/services/auth.service.ts` — stores/reads tokens, login, refresh, logout |
| Auth Guard | `core/guards/auth.guard.ts` — functional `CanActivateFn`, applied to `/events`, `/events/:id`, `/add-event`, `/edit-event/:id`; `/login` has no guard |
| Lazy loading | `app.routes.ts` — every feature route uses `loadComponent()` (standalone components, no NgModules needed) |
| Events list | `features/events/events-list/*` — `EventService.getEvents()` via `HttpClient` + `Observable`, rendered with the `async` pipe; card actions for View/Edit/Delete |
| Event details | `features/events/event-details/*` — reads `:id` from `ActivatedRoute`, fetches via `EventService.getEventById()` |
| Add Event | `features/events/add-event/*` — Reactive Form with required fields, min title length, min capacity/price, valid date; submit disabled while invalid; sends form's raw value via POST |
| Edit Event | `features/events/edit-event/*` — loads event by id, `patchValue()`s the form, sends the form's `getRawValue()` via PUT (never hard-coded), navigates to `/events` on success |
| Delete Event | `events-list.component.ts` — `deleteEvent()` sends DELETE, refreshes the list via a `BehaviorSubject` trigger on success, shows an error message on failure |
| Auth Interceptor | `core/interceptors/auth.interceptor.ts` — functional `HttpInterceptorFn`, attaches `Authorization: Bearer <token>` to every request except `/auth/login` and `/auth/refresh`; components never touch the token |
| Refresh Token flow | Same interceptor — on `401`, calls `AuthService.refreshToken()`, retries the original request with the new token; concurrent 401s share a single in-flight refresh via a `BehaviorSubject` queue; if refresh fails, `AuthService.logout()` clears tokens and redirects to `/login` |

## 4. Notes

- All feature components are **standalone** (Angular's modern approach), so no
  `NgModule` files are needed anywhere in the app.
- `EventService` never adds the token itself — that's entirely the interceptor's job,
  matching the "no manual token handling in components/services" requirement.
- Date values from the API are normalized to `yyyy-MM-dd` for the `<input type="date">`
  control when editing; adjust `toDateInputValue()` if your backend returns a different
  date format.
