import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class AdminStatisticsComponent {
  systemMetrics = [
    { label: 'API Gateway Availability', val: '99.98%', icon: 'cloud_done' },
    { label: 'Database Health (MongoDB)', val: 'Optimal', icon: 'database' },
    { label: 'Cloud Storage (Cloudinary)', val: 'Connected', icon: 'cloud_upload' },
    { label: 'Auth Token Engine (JWT)', val: 'Active', icon: 'token' }
  ];
}
