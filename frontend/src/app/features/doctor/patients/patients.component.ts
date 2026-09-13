import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, EmptyStateComponent, DateFormatPipe],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class DoctorPatientsComponent implements OnInit {
  private patientService = inject(PatientService);

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading = true;
  isBackendModulePending = false;
  searchQuery = '';

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;
    this.patientService.getPatients().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.patients = res.data || [];
        this.filteredPatients = this.patients;
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    if (!this.searchQuery) {
      this.filteredPatients = this.patients;
      return;
    }
    this.filteredPatients = this.patients.filter(p => 
      p.healthId?.toLowerCase().includes(this.searchQuery) ||
      (typeof p.userId === 'object' && (p.userId as any).firstName?.toLowerCase().includes(this.searchQuery))
    );
  }
}
