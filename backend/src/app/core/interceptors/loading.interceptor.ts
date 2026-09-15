import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = signal<number>(0);
  isLoading = signal<boolean>(false);

  show(): void {
    this.activeRequests.update(n => n + 1);
    this.isLoading.set(true);
  }

  hide(): void {
    this.activeRequests.update(n => Math.max(0, n - 1));
    if (this.activeRequests() === 0) {
      this.isLoading.set(false);
    }
  }
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
