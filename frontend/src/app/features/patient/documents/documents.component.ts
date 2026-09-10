import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DocumentService } from '../../../core/services/document.service';
import { MedicalDocument } from '../../../core/models/document.model';
import { DocumentCardComponent } from '../../../shared/components/document-card/document-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-patient-documents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DocumentCardComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class PatientDocumentsComponent implements OnInit {
  private docService = inject(DocumentService);
  private fb = inject(FormBuilder);

  documents: MedicalDocument[] = [];
  isLoading = true;
  isBackendModulePending = false;
  isUploadModalOpen = false;
  isUploading = false;
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  uploadForm = this.fb.group({
    title: ['', [Validators.required]],
    type: ['LAB_REPORT', [Validators.required]],
    notes: ['']
  });

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.docService.getDocuments().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.documents = res.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  submitUpload(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.uploadForm.value.title!);
    formData.append('type', this.uploadForm.value.type!);
    if (this.uploadForm.value.notes) formData.append('notes', this.uploadForm.value.notes);

    this.docService.uploadDocument(formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.isUploadModalOpen = false;
        this.uploadForm.reset({ type: 'LAB_REPORT' });
        this.selectedFile = null;
        this.successMessage = 'Document uploaded successfully.';
        this.loadDocuments();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = err.message || 'Failed to upload document.';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  onDelete(doc: MedicalDocument): void {
    this.docService.deleteDocument(doc._id).subscribe({
      next: () => {
        this.successMessage = 'Document deleted.';
        this.loadDocuments();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to delete document.';
      }
    });
  }
}
