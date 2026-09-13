import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class AdminComplaintsComponent {
  complaints: any[] = [];
}
