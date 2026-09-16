import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ConsentService } from '../../../core/services/consent.service';

const CONSENT_TYPES = [
  { value: 'MEDICAL_RECORD_ACCESS', label: 'Medical Record Access' },
  { value: 'DOCUMENT_ACCESS', label: 'Document Access' },
  { value: 'PRESCRIPTION_ACCESS', label: 'Prescription Access' },
  { value: 'CHAT_ACCESS', label: 'Chat Access' },
  { value: 'FULL_ACCESS', label: 'Full Access' },
  { value: 'OTHER', label: 'Other' },
];

const CONSENT_SCOPES = [
  'MEDICAL_RECORDS',
  'DOCUMENTS',
  'PRESCRIPTIONS',
  'APPOINTMENTS',
  'ENCOUNTERS',
  'PROFILE',
  'CHAT',
];

@Component({
  selector: 'app-request-consent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-consent.component.component.html',
  styleUrl: './request-consent.component.component.css'
})
export class RequestConsentComponent {
  @Input({ required: true }) patientId!: string;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() requested = new EventEmitter<void>();

  private consentService = inject(ConsentService);
  private fb = inject(FormBuilder);

  readonly consentTypes = CONSENT_TYPES;
  readonly consentScopes = CONSENT_SCOPES;

  isSubmitting = false;
  errorMessage: string | null = null;

  form = this.fb.group({
    type: ['DOCUMENT_ACCESS', [Validators.required]],
    scope: this.fb.array(
      CONSENT_SCOPES.map(() => this.fb.control(false))
    ),
    reason: [''],
  });

  get scopeControls() {
    return (this.form.get('scope') as any).controls as any[];
  }

  private get selectedScopes(): string[] {
    return CONSENT_SCOPES.filter((_, i) => this.scopeControls[i].value);
  }

  close(): void {
    this.errorMessage = null;
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  submit(): void {
    const scope = this.selectedScopes;

    if (this.form.get('type')?.invalid || scope.length === 0) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please select a type and at least one permission.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.consentService
      .requestConsent(
        this.patientId,
        this.form.value.type!,
        scope,
        this.form.value.reason || undefined
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.form.reset({ type: 'DOCUMENT_ACCESS' });
          this.scopeControls.forEach((c) => c.setValue(false));
          this.requested.emit();
          this.closed.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.message || 'Failed to send consent request.';
        },
      });
  }
}