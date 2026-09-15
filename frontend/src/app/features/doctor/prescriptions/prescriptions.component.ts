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
  completePrescription(prescription: Prescription): void {
  this.rxService.updatePrescription(prescription._id, {
    status: 'COMPLETED'
  }).subscribe({
    next: () => {
      this.successMessage = 'Prescription marked as completed.';
      this.loadPrescriptions();

      setTimeout(() => this.successMessage = null, 3000);
    },
    error: (err) => {
      this.errorMessage =
        err.message || 'Failed to complete prescription.';

      setTimeout(() => this.errorMessage = null, 3000);
    }
  });
}
printPrescription(prescription: Prescription): void {
  const medications = prescription.medications
    .map(
      (med) => `
        <tr>
          <td>${med.medicationName}</td>
          <td>${med.dosage}</td>
          <td>${med.frequency}</td>
          <td>${med.duration}</td>
          <td>${med.instructions}</td>
        </tr>
      `
    )
    .join('');

  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Prescription - ${prescription.prescriptionCode || 'MEDLINK'}</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #111827;
          }

          h1 {
            margin-bottom: 5px;
            color: #0f766e;
          }

          .subtitle {
            color: #6b7280;
            margin-bottom: 30px;
          }

          .info {
            margin-bottom: 25px;
          }

          .info p {
            margin: 8px 0;
          }

          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin: 25px 0 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th,
          td {
            border: 1px solid #d1d5db;
            padding: 10px;
            text-align: left;
          }

          th {
            background: #f3f4f6;
          }

          .status {
            display: inline-block;
            padding: 5px 12px;
            border: 1px solid #10b981;
            border-radius: 20px;
            font-weight: bold;
          }

          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>

      <body>
        <h1>MEDLINK</h1>

        <div class="subtitle">
          Digital Prescription
        </div>

        <div class="info">
          <p>
            <strong>Prescription:</strong>
            ${prescription.prescriptionCode || 'RX-MEDLINK'}
          </p>

          <p>
            <strong>Status:</strong>
            <span class="status">${prescription.status}</span>
          </p>

          <p>
            <strong>Patient:</strong>
            ${prescription.patientName || '-'}
          </p>

          <p>
            <strong>Patient Health ID:</strong>
            ${prescription.patientHealthId || '-'}
          </p>

          <p>
            <strong>Doctor:</strong>
            Dr. ${prescription.doctorName || '-'}
          </p>

          <p>
            <strong>Issued on:</strong>
            ${new Date(prescription.issueDate).toLocaleDateString()}
          </p>

          ${
            prescription.diagnosis
              ? `<p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>`
              : ''
          }
        </div>

        <div class="section-title">
          Medications
        </div>

        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Instructions</th>
            </tr>
          </thead>

          <tbody>
            ${medications}
          </tbody>
        </table>

        ${
          prescription.notes
            ? `
              <div class="section-title">Notes</div>
              <p>${prescription.notes}</p>
            `
            : ''
        }
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
  prescriptions: Prescription[] = [];
  isLoading = true;
  isBackendModulePending = false;
  isCreateModalOpen = false;
  editingPrescription: Prescription | null = null;
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
editPrescription(prescription: Prescription): void {
  this.editingPrescription = prescription;
  this.isCreateModalOpen = true;

  this.rxForm.patchValue({
    patientId: prescription.patientHealthId || '',
    patientName: prescription.patientName || '',
    diagnosis: prescription.diagnosis || '',
    medName: prescription.medications[0]?.medicationName || '',
    dosage: prescription.medications[0]?.dosage || '',
    frequency: prescription.medications[0]?.frequency || '',
    duration: prescription.medications[0]?.duration || '',
    instructions: prescription.medications[0]?.instructions || ''
  });
}
 issuePrescription(): void {
  if (this.rxForm.invalid) {
    this.rxForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  const val = this.rxForm.value;

  // UPDATE
  if (this.editingPrescription) {
    const payload: Partial<Prescription> = {
      diagnosis: val.diagnosis!,
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

    this.rxService
      .updatePrescription(this.editingPrescription._id, payload)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.isCreateModalOpen = false;
          this.editingPrescription = null;

          this.rxForm.reset({
            frequency: 'Once Daily',
            duration: '30 Days'
          });

          this.successMessage = 'Prescription updated successfully.';
          this.loadPrescriptions();

          setTimeout(() => this.successMessage = null, 3000);
        },

        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage =
            err.message || 'Failed to update prescription.';

          setTimeout(() => this.errorMessage = null, 3000);
        }
      });

    return;
  }

  // CREATE
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

      this.rxForm.reset({
        frequency: 'Once Daily',
        duration: '30 Days'
      });

      this.successMessage =
        'Digital prescription signed and dispatched.';

      this.loadPrescriptions();

      setTimeout(() => this.successMessage = null, 3000);
    },

    error: (err) => {
      this.isSubmitting = false;
      this.errorMessage =
        err.message || 'Failed to issue prescription.';

      setTimeout(() => this.errorMessage = null, 3000);
    }
  });
}
}
