import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationMeta } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() meta?: PaginationMeta;
  @Output() pageChange = new EventEmitter<number>();

  onPrev(): void {
    if (this.meta && this.meta.page > 1) {
      this.pageChange.emit(this.meta.page - 1);
    }
  }

  onNext(): void {
    if (this.meta && this.meta.page < this.meta.totalPages) {
      this.pageChange.emit(this.meta.page + 1);
    }
  }
}
