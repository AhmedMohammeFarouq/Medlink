import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-follow-ups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './follow-ups.component.html',
  styleUrl: './follow-ups.component.css'
})
export class DoctorFollowUpsComponent {
  followUps = [
    { name: 'Youssef Ibrahim', healthId: 'MV-2026-9A73K21', reason: 'Hypertension / Lipid Re-check', due: 'In 14 Days', status: 'Scheduled' },
    { name: 'Nourhan Salem', healthId: 'MV-2026-11B4K88', reason: 'HbA1c Post-Treatment Review', due: 'Overdue (3 Days)', status: 'Pending Contact' }
  ];
}
