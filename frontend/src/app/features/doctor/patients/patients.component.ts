import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient } from '../../../core/models/patient.model';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { resolveId } from '../../../core/utils/id.util';


import { RequestConsentComponent } from '../request-consent.component/request-consent.component.component';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, EmptyStateComponent, DateFormatPipe, RequestConsentComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class DoctorPatientsComponent implements OnInit {
  private patientService = inject(PatientService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading = true;
  isBackendModulePending = false;
  searchQuery = '';
  startingChatForPatientId: string | null = null;
  selectedPatientForConsent: Patient | null = null;
  isConsentModalOpen = false;
  successMessage: string | null = null;

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
  viewEncounters(patientId: string): void {
    this.router.navigate(['/doctor/patients', patientId, 'encounters']);
  }


  messagePatient(patient: Patient): void {
    const patientUserId = resolveId(patient.userId);
    const doctorUserId = this.currentUser()?._id;

    if (!patientUserId || !doctorUserId) {
      return;
    }

    this.startingChatForPatientId = patient._id;
    this.chatService.createOrGetRoom(patientUserId, doctorUserId).subscribe({
      next: (res) => {
        this.startingChatForPatientId = null;
        this.router.navigate(['/doctor/chat'], { queryParams: { roomId: res.data._id } });
      },
      error: () => {
        this.startingChatForPatientId = null;
      }
    });
  }

  openConsentModal(patient: Patient): void {
    this.selectedPatientForConsent = patient;
    this.isConsentModalOpen = true;
  }

  onConsentRequested(): void {
    this.successMessage = 'Consent request sent to patient.';
    setTimeout(() => this.successMessage = null, 3000);
  }
}
