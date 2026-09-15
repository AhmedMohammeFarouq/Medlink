export interface AuditLog {
  _id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AuditLogFilters {
  actorId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Shape returned inside `data` by the audit/reviews/pending-doctors list
// endpoints on this backend: { data, total, page, limit } — note there is
// no top-level `meta` / `totalPages` here (unlike /users), so callers
// should derive totalPages = Math.ceil(total / limit) themselves.
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
