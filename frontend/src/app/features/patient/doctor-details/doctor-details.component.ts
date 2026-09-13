import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';

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

  doctor: Doctor | null = null;
  isLoading = true;
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
}
