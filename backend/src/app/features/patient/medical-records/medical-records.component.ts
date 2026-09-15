import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordService } from '../../../core/services/medical-record.service';
import { MedicalRecord } from '../../../core/models/medical-record.model';
import { MedicalRecordCardComponent } from '../../../shared/components/medical-record-card/medical-record-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, MedicalRecordCardComponent, EmptyStateComponent],
  templateUrl: './medical-records.component.html',
  styleUrl: './medical-records.component.css'
})
export class MedicalRecordsComponent implements OnInit {
  private recordService = inject(MedicalRecordService);

  records: MedicalRecord[] = [];
  isLoading = true;
  isBackendModulePending = false;

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.isLoading = true;
    this.recordService.getRecords().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.records = res.data || [];
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }
}
