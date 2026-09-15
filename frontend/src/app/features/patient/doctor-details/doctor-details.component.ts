import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { Doctor } from '../../../core/models/doctor.model';
import { resolveId } from '../../../core/utils/id.util';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.css'
})
export class DoctorDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private doctorService = inject(DoctorService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  doctor: Doctor | null = null;
  isLoading = true;
  isStartingChat = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDoctor(id);
    }
  }

  loadDoctor(id: string): void {
    this.isLoading = true;
    this.doctorService.getDoctorById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.doctor = res.data;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Specialist profile not found.';
      }
    });
  }

  bookAppointment(): void {
    if (this.doctor) {
      this.router.navigate(['/patient/appointments'], { queryParams: { doctorId: this.doctor._id } });
    }
  }

  messageDoctor(): void {
    if (!this.doctor) {
      return;
    }

    // Chat rooms are keyed by User _id on both sides (see chat.model.ts on
    // the backend), not by the Doctor/Patient profile _id - so we have to
    // resolve doctor.userId here rather than using doctor._id directly.
    const doctorUserId = resolveId(this.doctor.userId);
    const patientUserId = this.currentUser()?._id;

    if (!doctorUserId || !patientUserId) {
      this.errorMessage = 'You need to be signed in to start a conversation.';
      return;
    }

    this.isStartingChat = true;
    this.chatService.createOrGetRoom(patientUserId, doctorUserId).subscribe({
      next: (res) => {
        this.isStartingChat = false;
        this.router.navigate(['/patient/chat'], { queryParams: { roomId: res.data._id } });
      },
      error: (err) => {
        this.isStartingChat = false;
        this.errorMessage = err.message || 'Could not start the conversation. Please try again.';
      }
    });
  }
}
