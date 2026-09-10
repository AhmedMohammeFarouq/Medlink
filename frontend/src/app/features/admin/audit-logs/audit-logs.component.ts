import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css'
})
export class AdminAuditLogsComponent {
  logs = [
    { event: 'USER_LOGIN', user: 'admin@medlink.com', ip: '192.168.1.1', status: 'SUCCESS', time: 'Just now' },
    { event: 'USER_REGISTER', user: 'patient@example.com', ip: '197.34.12.9', status: 'SUCCESS', time: '10 mins ago' },
    { event: 'PASSWORD_CHANGE', user: 'doctor@medlink.com', ip: '156.204.88.2', status: 'SUCCESS', time: '1 hour ago' }
  ];
}
