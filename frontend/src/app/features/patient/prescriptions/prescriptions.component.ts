import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { Prescription } from '../../../core/models/prescription.model';
import { PrescriptionCardComponent } from '../../../shared/components/prescription-card/prescription-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-prescriptions',
  standalone: true,
  imports: [CommonModule, PrescriptionCardComponent, EmptyStateComponent],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.css'
})
export class PatientPrescriptionsComponent implements OnInit {
  private rxService = inject(PrescriptionService);

  prescriptions: Prescription[] = [];
  isLoading = true;
  isBackendModulePending = false;

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

  onPrint(rx: Prescription): void {
    window.print();
  }
}
