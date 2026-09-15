import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuditService } from '../../../core/services/audit.service';
import { UserService } from '../../../core/services/user.service';
import { AuditLog } from '../../../core/models/audit.model';
import { User } from '../../../core/models/user.model';
import { PaginationMeta } from '../../../core/models/api-response.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DateFormatPipe,
    EmptyStateComponent,
    ModalComponent,
    PaginationComponent,
    PageHeaderComponent,
    IconComponent
  ],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css'
})
export class AdminAuditLogsComponent implements OnInit {
  private auditService = inject(AuditService);
  private userService = inject(UserService);

  logs: AuditLog[] = [];
  actors: Record<string, User> = {};
  paginationMeta?: PaginationMeta;

  isLoading = true;
  errorMessage: string | null = null;
  currentPage = 1;
  pageSize = 20;

  // Filters
  filterAction = '';
  filterResourceType = '';
  filterActorId = '';
  filterStartDate = '';
  filterEndDate = '';

  // Details modal
  isDetailsModalOpen = false;
  selectedLog: AuditLog | null = null;
  isDetailsLoading = false;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true;
    this.errorMessage = null;

    const filters: any = { page, limit: this.pageSize };
    if (this.filterAction.trim()) filters.action = this.filterAction.trim();
    if (this.filterResourceType.trim()) filters.resourceType = this.filterResourceType.trim();
    if (this.filterActorId.trim()) filters.actorId = this.filterActorId.trim();
    if (this.filterStartDate) filters.startDate = this.filterStartDate;
    if (this.filterEndDate) filters.endDate = this.filterEndDate;

    this.auditService.getLogs(filters).subscribe({
      next: (res) => {
        const result = res.data;
        this.logs = result?.data || [];
        const total = result?.total || 0;
        const limit = result?.limit || this.pageSize;
        const currentPageNum = result?.page || page;
        // This endpoint returns {data, total, page, limit} nested in `data`
        // (no top-level `meta`/totalPages like /users), so we derive it here
        // to reuse the shared pagination component.
        this.paginationMeta = {
          page: currentPageNum,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit))
        };
        this.resolveActors();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to load audit logs.';
      }
    });
  }

  private resolveActors(): void {
    const idsToFetch = Array.from(
      new Set(this.logs.map((l) => l.actorId).filter((id) => !!id && !this.actors[id]))
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
        if (r.user) this.actors[r.id] = r.user;
      });
      this.isLoading = false;
    });
  }

  actorLabel(log: AuditLog): string {
    const user = this.actors[log.actorId];
    return user ? `${user.firstName} ${user.lastName} (${user.email})` : log.actorId;
  }

  applyFilters(): void {
    this.loadLogs(1);
  }

  clearFilters(): void {
    this.filterAction = '';
    this.filterResourceType = '';
    this.filterActorId = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.loadLogs(1);
  }

  openDetails(log: AuditLog): void {
    this.selectedLog = log;
    this.isDetailsModalOpen = true;
    this.isDetailsLoading = true;

    this.auditService.getLogById(log._id).subscribe({
      next: (res) => {
        this.isDetailsLoading = false;
        if (res.success && res.data) {
          this.selectedLog = res.data;
        }
      },
      error: () => {
        this.isDetailsLoading = false;
      }
    });
  }

  formatMetadata(metadata?: Record<string, any>): string {
    if (!metadata) return '—';
    try {
      return JSON.stringify(metadata, null, 2);
    } catch {
      return String(metadata);
    }
  }
}
