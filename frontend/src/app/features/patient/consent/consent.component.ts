import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsentService } from '../../../core/services/consent.service';
import { ConsentRequest } from '../../../core/models/consent.model';
import { ConsentCardComponent } from '../../../shared/components/consent-card/consent-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-consent',
  standalone: true,
  imports: [CommonModule, ConsentCardComponent, EmptyStateComponent],
  templateUrl: './consent.component.html',
  styleUrl: './consent.component.css'
})
export class PatientConsentComponent implements OnInit {
  private consentService = inject(ConsentService);

  consents: ConsentRequest[] = [];
  isLoading = true;
  isBackendModulePending = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadConsents();
  }

  loadConsents(): void {
    this.isLoading = true;
    this.consentService.getConsents().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.consents = res.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  grantConsent(req: ConsentRequest): void {
    this.consentService.grantConsent(req._id).subscribe({
      next: () => {
        this.successMessage = 'Access granted.';
        this.loadConsents();
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  revokeConsent(req: ConsentRequest): void {
    this.consentService.revokeConsent(req._id).subscribe({
      next: () => {
        this.successMessage = 'Access revoked.';
        this.loadConsents();
      },
      error: (err) => this.errorMessage = err.message
    });
  }
}
