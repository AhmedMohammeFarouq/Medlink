import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicService } from '../../../core/services/clinic.service';
import { Clinic } from '../../../core/models/clinic.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-clinics',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  templateUrl: './clinics.component.html',
  styleUrl: './clinics.component.css'
})
export class AdminClinicsComponent implements OnInit {
  private clinicService = inject(ClinicService);

  clinics: Clinic[] = [];
  isLoading = true;
  isBackendModulePending = false;

  ngOnInit(): void {
    this.loadClinics();
  }

  loadClinics(): void {
    this.isLoading = true;
    this.clinicService.getClinics().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.clinics = res.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }
}
