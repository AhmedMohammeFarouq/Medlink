import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReviewService } from '../../../core/services/review.service';
import { UserService } from '../../../core/services/user.service';
import { DoctorReview, ReviewStatus } from '../../../core/models/review.model';
import { User } from '../../../core/models/user.model';
import { PaginationMeta } from '../../../core/models/api-response.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DateFormatPipe,
    EmptyStateComponent,
    ConfirmDialogComponent,
    PaginationComponent,
    PageHeaderComponent,
    IconComponent,
    RatingStarsComponent
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class AdminReviewsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private userService = inject(UserService);

  reviews: DoctorReview[] = [];
  patients: Record<string, User> = {};
  paginationMeta?: PaginationMeta;

  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentPage = 1;
  pageSize = 20;

  // Filters
  filterDoctorId = '';
  filterPatientId = '';
  filterStatus: ReviewStatus | '' = '';

  // Confirm dialog (shared for hide/unhide/delete)
  isConfirmOpen = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmIsDanger = false;
  confirmAction: (() => void) | null = null;

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true;
    this.errorMessage = null;

    const filters: any = { page, limit: this.pageSize };
    if (this.filterDoctorId.trim()) filters.doctorId = this.filterDoctorId.trim();
    if (this.filterPatientId.trim()) filters.patientId = this.filterPatientId.trim();
    if (this.filterStatus) filters.status = this.filterStatus;

    this.reviewService.getReviews(filters).subscribe({
      next: (res) => {
        const result = res.data;
        this.reviews = result?.data || [];
        const total = result?.total || 0;
        const limit = result?.limit || this.pageSize;
        const currentPageNum = result?.page || page;
        // This endpoint returns {data, total, page, limit} nested (no
        // top-level meta/totalPages) — derive it for the shared pager.
        this.paginationMeta = {
          page: currentPageNum,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit))
        };
        this.resolvePatients();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to load reviews.';
      }
    });
  }

  private resolvePatients(): void {
    const idsToFetch = Array.from(
      new Set(this.reviews.map((r) => r.patientId).filter((id) => !!id && !this.patients[id]))
    );

    if (idsToFetch.length === 0) {
      this.isLoading = false;
      return;
    }

    const requests = idsToFetch.map((id) =>
      this.userService.getUserById(id).pipe(
        map((res) => ({ id, user: res.data })),
        catchError(() => of({ id, user: null }))
      )
    );

    forkJoin(requests).subscribe((results) => {
      results.forEach((r) => {
        if (r.user) this.patients[r.id] = r.user;
      });
      this.isLoading = false;
    });
  }

  patientLabel(review: DoctorReview): string {
    const user = this.patients[review.patientId];
    return user ? `${user.firstName} ${user.lastName}` : review.patientId;
  }

  applyFilters(): void {
    this.loadReviews(1);
  }

  clearFilters(): void {
    this.filterDoctorId = '';
    this.filterPatientId = '';
    this.filterStatus = '';
    this.loadReviews(1);
  }

  toggleVisibility(review: DoctorReview): void {
    const nextStatus: ReviewStatus = review.status === 'HIDDEN' ? 'ACTIVE' : 'HIDDEN';
    this.confirmTitle = nextStatus === 'HIDDEN' ? 'Hide Review' : 'Unhide Review';
    this.confirmMessage =
      nextStatus === 'HIDDEN'
        ? 'This review will be hidden from public listings but not deleted. Continue?'
        : 'This review will become publicly visible again. Continue?';
    this.confirmIsDanger = nextStatus === 'HIDDEN';
    this.confirmAction = () => {
      this.reviewService.setReviewStatus(review._id, nextStatus).subscribe({
        next: () => {
          this.isConfirmOpen = false;
          this.successMessage = `Review ${nextStatus === 'HIDDEN' ? 'hidden' : 'restored'} successfully.`;
          this.loadReviews(this.currentPage);
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          this.isConfirmOpen = false;
          this.errorMessage = err.message || 'Failed to update review status.';
        }
      });
    };
    this.isConfirmOpen = true;
  }

  deleteReview(review: DoctorReview): void {
    this.confirmTitle = 'Delete Review';
    this.confirmMessage = 'This will soft-delete the review and recalculate the doctor rating. Continue?';
    this.confirmIsDanger = true;
    this.confirmAction = () => {
      this.reviewService.deleteReview(review._id).subscribe({
        next: () => {
          this.isConfirmOpen = false;
          this.successMessage = 'Review deleted successfully.';
          this.loadReviews(this.currentPage);
          setTimeout(() => (this.successMessage = null), 3000);
        },
        error: (err) => {
          this.isConfirmOpen = false;
          this.errorMessage = err.message || 'Failed to delete review.';
        }
      });
    };
    this.isConfirmOpen = true;
  }

  onConfirm(): void {
    if (this.confirmAction) {
      this.confirmAction();
    }
  }
}
