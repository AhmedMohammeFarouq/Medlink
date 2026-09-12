import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { Doctor } from '../../../core/models/doctor.model';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-patient-doctors',
  standalone: true,
  imports: [CommonModule, DoctorCardComponent, SearchBarComponent, EmptyStateComponent, PageHeaderComponent, IconComponent],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class PatientDoctorsComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private router = inject(Router);

  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  isLoading = true;
  isBackendModulePending = false;
  searchQuery = '';

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.doctors = res.data || [];
        this.filteredDoctors = this.doctors;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404 || err.status === 500) {
          this.isBackendModulePending = true;
        }
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    if (!this.searchQuery) {
      this.filteredDoctors = this.doctors;
      return;
    }
    this.filteredDoctors = this.doctors.filter(d => 
      d.professionalInfo.specialty.toLowerCase().includes(this.searchQuery) ||
      (d.professionalInfo.bio && d.professionalInfo.bio.toLowerCase().includes(this.searchQuery))
    );
  }

  onBook(doctor: Doctor): void {
    this.router.navigate(['/patient/appointments'], { queryParams: { doctorId: doctor._id } });
  }

  onViewProfile(doctor: Doctor): void {
    this.router.navigate(['/patient/doctors', doctor._id]);
  }
}
