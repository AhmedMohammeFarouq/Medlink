import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class DoctorScheduleComponent {
  daysOfWeek = [
    { day: 'Monday', active: true, hours: '09:00 AM - 05:00 PM', slots: 16 },
    { day: 'Tuesday', active: true, hours: '09:00 AM - 05:00 PM', slots: 16 },
    { day: 'Wednesday', active: true, hours: '09:00 AM - 05:00 PM', slots: 16 },
    { day: 'Thursday', active: true, hours: '09:00 AM - 05:00 PM', slots: 16 },
    { day: 'Friday', active: false, hours: 'Off Duty', slots: 0 },
    { day: 'Saturday', active: true, hours: '10:00 AM - 02:00 PM', slots: 8 },
    { day: 'Sunday', active: false, hours: 'Off Duty', slots: 0 }
  ];
}
