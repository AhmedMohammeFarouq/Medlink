import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { Prescription } from '../../../core/models/prescription.model';
import { PrescriptionCardComponent } from '../../../shared/components/prescription-card/prescription-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-doctor-prescriptions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrescriptionCardComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.css'
})
export class DoctorPrescriptionsComponent implements OnInit {
  patientLookupStatus: 'idle' | 'searching' | 'found' | 'not_found' = 'idle';
foundPatientName: string | null = null;

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
    patientPhone: ['', [Validators.required]],
    diagnosis: ['', [Validators.required]],
    medName: ['', [Validators.required]],
    dosage: ['', [Validators.required]],
    frequency: ['Once Daily', [Validators.required]],
    duration: ['30 Days', [Validators.required]],
    instructions: ['Take after meals with water', [Validators.required]]
  });
  ngOnInit(): void {
    this.loadPrescriptions();
    this.watchPatientPhone();
  }

  watchPatientPhone(): void {
    this.rxForm.get('patientPhone')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((phone) => {
        if (!phone || phone.trim().length < 8) {
          this.patientLookupStatus = 'idle';
          this.foundPatientName = null;
          return of(null);
        }
        this.patientLookupStatus = 'searching';
        return this.rxService.lookupPatient(phone.trim());
      })
    ).subscribe({
      next: (res) => {
        if (!res) return;
        if (res.success && res.data?.patientName) {
          this.patientLookupStatus = 'found';
          this.foundPatientName = res.data.patientName;
        } else {
          this.patientLookupStatus = 'not_found';
          this.foundPatientName = null;
        }
      },
      error: () => {
        this.patientLookupStatus = 'not_found';
        this.foundPatientName = null;
      }
    });
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
    if (this.rxForm.invalid || this.patientLookupStatus !== 'found') {
      this.rxForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
  const val = this.rxForm.value;
  const payload: Partial<Prescription> = {
    patientPhone: val.patientPhone!,
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
      this.patientLookupStatus = 'idle';
      this.foundPatientName = null;
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
    onPrint(rx: Prescription): void {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Prescription</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { border-bottom: 2px solid #333; padding-bottom: 10px; }
          .row { margin: 8px 0; }
          .label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h2>Prescription</h2>
        <div class="row"><span class="label">Patient:</span> ${rx.patientName || 'Unknown Patient'}</div>
        <div class="row"><span class="label">Diagnosis:</span> ${rx.diagnosis || '-'}</div>
        <div class="row"><span class="label">Date:</span> ${new Date(rx.issueDate).toLocaleDateString()}</div>
        <table>
          <thead>
            <tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr>
          </thead>
          <tbody>
            ${rx.medications.map(m => `
              <tr>
                <td>${m.medicationName}</td>
                <td>${m.dosage}</td>
                <td>${m.frequency}</td>
                <td>${m.duration || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

onDiscontinue(rx: Prescription): void {
  if (!confirm('Are you sure you want to discontinue this prescription?')) return;

  this.rxService.updatePrescriptionStatus(rx._id, 'DISCONTINUED').subscribe({
    next: () => {
      this.successMessage = 'Prescription discontinued.';
      this.loadPrescriptions();
      setTimeout(() => this.successMessage = null, 3000);
    },
    error: (err) => {
      this.errorMessage = err.message || 'Failed to discontinue prescription.';
      setTimeout(() => this.errorMessage = null, 3000);
    }
  });
}
}
