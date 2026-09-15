import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { Prescription } from '../../../core/models/prescription.model';
import { PrescriptionCardComponent } from '../../../shared/components/prescription-card/prescription-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-doctor-prescriptions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrescriptionCardComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.css'
})
export class DoctorPrescriptionsComponent implements OnInit {
  private rxService = inject(PrescriptionService);
  private fb = inject(FormBuilder);

  prescriptions: Prescription[] = [];
  isLoading = true;
  isBackendModulePending = false;
  isCreateModalOpen = false;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  rxForm = this.fb.group({
    patientId: ['', [Validators.required]],
    patientName: ['', [Validators.required]],
    diagnosis: ['', [Validators.required]],
    medName: ['', [Validators.required]],
    dosage: ['', [Validators.required]],
    frequency: ['Once Daily', [Validators.required]],
    duration: ['30 Days', [Validators.required]],
    instructions: ['Take after meals with water', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.isLoading = true;
    this.rxService.getPrescriptions().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.prescriptions = res.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  issuePrescription(): void {
    if (this.rxForm.invalid) {
      this.rxForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const val = this.rxForm.value;
    const payload: Partial<Prescription> = {
      patientId: val.patientId!,
      patientName: val.patientName!,
      diagnosis: val.diagnosis!,
      issueDate: new Date(),
      status: 'ACTIVE',
      medications: [
        {
          medicationName: val.medName!,
          dosage: val.dosage!,
          frequency: val.frequency!,
          route: 'Oral',
          duration: val.duration!,
          instructions: val.instructions!
        }
      ]
    };

    this.rxService.createPrescription(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isCreateModalOpen = false;
        this.rxForm.reset({ frequency: 'Once Daily', duration: '30 Days' });
        this.successMessage = 'Digital prescription signed and dispatched.';
        this.loadPrescriptions();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message || 'Failed to issue prescription.';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }
}
