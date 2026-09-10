import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EncounterService } from '../../../core/services/encounter.service';
import { Encounter } from '../../../core/models/encounter.model';
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

  encounters: Encounter[] = [];
  isLoading = true;
  isBackendModulePending = false;
  isCreateModalOpen = false;
  isSaving = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  encounterForm = this.fb.group({
    patientId: ['', [Validators.required]],
    chiefComplaint: ['', [Validators.required]],
    subjective: [''],
    objective: [''],
    assessment: [''],
    plan: ['']
  });

  ngOnInit(): void {
    this.loadEncounters();
  }

  loadEncounters(): void {
    this.isLoading = true;
    this.encService.getEncounters().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.encounters = res.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  createEncounter(): void {
    if (this.encounterForm.invalid) {
      this.encounterForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const val = this.encounterForm.value;
    const payload: Partial<Encounter> = {
      patientId: val.patientId!,
      chiefComplaint: val.chiefComplaint!,
      subjective: val.subjective || undefined,
      objective: val.objective || undefined,
      assessment: val.assessment || undefined,
      plan: val.plan || undefined,
      date: new Date(),
      status: 'COMPLETED'
    };

    this.encService.createEncounter(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.isCreateModalOpen = false;
        this.encounterForm.reset();
        this.successMessage = 'Clinical encounter documented successfully.';
        this.loadEncounters();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Failed to save encounter note.';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }
}
