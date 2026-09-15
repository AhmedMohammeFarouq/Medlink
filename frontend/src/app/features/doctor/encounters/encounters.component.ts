import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EncounterService } from '../../../core/services/encounter.service';
import { Encounter, EncounterType, CreateEncounterPayload } from '../../../core/models/encounter.model';
import { AuthService } from '../../../core/services/auth.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-doctor-encounters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmptyStateComponent, ModalComponent, DateFormatPipe],
  templateUrl: './encounters.component.html',
  styleUrl: './encounters.component.css'
})
export class DoctorEncountersComponent implements OnInit {
  private encService = inject(EncounterService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  encounters: Encounter[] = [];
  patientId = '';
  isLoading = true;
  isBackendModulePending = false;
  isCreateModalOpen = false;
  isSaving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  encounterTypes: EncounterType[] = ['CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'ONLINE', 'IN_PERSON'];

  encounterForm = this.fb.group({
    patientId: [''],
    type: ['CONSULTATION' as EncounterType, [Validators.required]],
    chiefComplaint: ['', [Validators.required]],
    clinicalNotes: [''],
    treatmentPlan: ['']
  });

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId') ?? '';

    if (!this.patientId) {
      this.isLoading = false;
      return;
    }

    this.loadEncounters();
  }

  loadEncounters(): void {
    if (!this.patientId) return;

    this.isLoading = true;
    this.isBackendModulePending = false;
    this.errorMessage = null;

    this.encService.getEncountersByPatient(this.patientId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.encounters = res.data || [];
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404 || err.status === 0) {
          this.isBackendModulePending = true;
        } else {
          this.errorMessage = err.error?.message || 'Failed to load encounters.';
        }
      }
    });
  }

  createEncounter(): void {
    const val = this.encounterForm.value;
    const targetPatientId = this.patientId || val.patientId;

    if (!targetPatientId) {
      this.errorMessage = 'Please enter or select a valid Patient ID.';
      return;
    }

    if (this.encounterForm.invalid) {
      this.encounterForm.markAllAsTouched();
      return;
    }

    const doctorId = this.authService.currentUser()?._id;

    if (!doctorId) {
      this.errorMessage = 'Unable to identify the logged-in doctor.';
      return;
    }

    this.isSaving = true;

    const payload: CreateEncounterPayload = {
      patientId: targetPatientId,
      doctorId,
      type: val.type!,
      chiefComplaint: val.chiefComplaint!,
      clinicalNotes: val.clinicalNotes || undefined,
      treatmentPlan: val.treatmentPlan || undefined,
    };

    this.encService.createEncounter(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.isCreateModalOpen = false;
        this.encounterForm.reset({ type: 'CONSULTATION' });
        this.errorMessage = null;
        this.successMessage = 'Clinical encounter documented successfully.';
        
        this.patientId = targetPatientId;
        this.loadEncounters();

        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Failed to save encounter note.';
        setTimeout(() => (this.errorMessage = null), 3000);
      }
    });
  }
}