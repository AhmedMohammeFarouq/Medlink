import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../core/services/patient.service';
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
  private patientService = inject(PatientService);

  records: MedicalRecord[] = [];
  patientId!: string;
  isLoading = true;
  isBackendModulePending = false;

  ngOnInit(): void {
    this.loadMyRecords();
  }

  private loadMyRecords(): void {
    this.isLoading = true;

    this.patientService.getPatient().subscribe({
      next: (res) => {
        this.patientId = (res.data as any)?._id ?? (res.data as any)?.id ?? '';

        if (!this.patientId) {
          this.isLoading = false;
          this.isBackendModulePending = true;
          return;
        }

        this.loadRecords();
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }

  private loadRecords(): void {
    this.recordService.getMedicalRecordByPatientId(this.patientId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isBackendModulePending = false;

        // الـ backend بيرجع سجل واحد (object)، مش array
        const data = res.data;
        this.records = Array.isArray(data) ? data : (data ? [data] : []);
      },
      error: () => {
        this.isLoading = false;
        this.isBackendModulePending = true;
      }
    });
  }
}














































// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { MedicalRecordService } from '../../../core/services/medical-record.service';
// import { MedicalRecord } from '../../../core/models/medical-record.model';
// import { MedicalRecordCardComponent } from '../../../shared/components/medical-record-card/medical-record-card.component';
// import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

// @Component({
//   selector: 'app-medical-records',
//   standalone: true,
//   imports: [CommonModule, MedicalRecordCardComponent, EmptyStateComponent],
//   templateUrl: './medical-records.component.html',
//   styleUrl: './medical-records.component.css'
// })
// export class MedicalRecordsComponent implements OnInit {
//   private recordService = inject(MedicalRecordService);
//   private route = inject(ActivatedRoute);

//   records: MedicalRecord[] = [];
//   patientId!: string;
//   isLoading = true;
//   isBackendModulePending = false;

//   ngOnInit(): void {
//     this.patientId = this.route.snapshot.paramMap.get('patientId') ?? '';
//     this.loadRecords();
//   }

//   loadRecords(): void {
//     this.isLoading = true;

//     this.recordService.getMedicalRecordByPatientId(this.patientId).subscribe({
//     next: (res: any) => {
//       this.isLoading = false;
//       this.records = res.data || [];
//     },
// this.recordService.getRecords().subscribe({
//   next: (res) => {
//     this.isLoading = false;
//     this.records = res.data || [];
//   },
//       error: () => {
//         this.isLoading = false;
//         this.isBackendModulePending = true;
//       }
//     });
//   }
// }
