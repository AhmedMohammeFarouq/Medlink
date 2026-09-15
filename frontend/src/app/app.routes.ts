import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { ROLES } from './core/constants/roles';

// Layouts
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PatientLayoutComponent } from './layout/patient-layout/patient-layout.component';
import { DoctorLayoutComponent } from './layout/doctor-layout/doctor-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

// Public & Auth Pages
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyAccountComponent } from './features/auth/verify-account/verify-account.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';

// Patient Pages
import { PatientDashboardComponent } from './features/patient/dashboard/dashboard.component';
import { PatientAppointmentsComponent } from './features/patient/appointments/appointments.component';
import { PatientDoctorsComponent } from './features/patient/doctors/doctors.component';
import { DoctorDetailsComponent } from './features/patient/doctor-details/doctor-details.component';
import { MedicalRecordsComponent } from './features/patient/medical-records/medical-records.component';
import { PatientPrescriptionsComponent } from './features/patient/prescriptions/prescriptions.component';
import { PatientDocumentsComponent } from './features/patient/documents/documents.component';
import { PatientConsentComponent } from './features/patient/consent/consent.component';
import { PatientNotificationsComponent } from './features/patient/notifications/notifications.component';
import { PatientChatComponent } from './features/patient/chat/chat.component';
import { PatientProfileComponent } from './features/patient/profile/profile.component';
import { SettingsComponent } from './features/patient/settings/settings.component';

// Doctor Pages
import { DoctorDashboardComponent } from './features/doctor/dashboard/dashboard.component';
import { DoctorAppointmentsComponent } from './features/doctor/appointments/appointments.component';
import { DoctorPatientsComponent } from './features/doctor/patients/patients.component';
import { DoctorEncountersComponent } from './features/doctor/encounters/encounters.component';
import { DoctorPrescriptionsComponent } from './features/doctor/prescriptions/prescriptions.component';
import { DoctorScheduleComponent } from './features/doctor/schedule/schedule.component';
import { DoctorFollowUpsComponent } from './features/doctor/follow-ups/follow-ups.component';
import { DoctorChatComponent } from './features/doctor/chat/chat.component';
import { DoctorProfileComponent } from './features/doctor/profile/profile.component';
import { DoctorSettingsComponent } from './features/doctor/settings/settings.component';

// Admin Pages
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { UsersComponent } from './features/admin/users/users.component';
import { DoctorVerificationComponent } from './features/admin/doctor-verification/doctor-verification.component';
import { AdminClinicsComponent } from './features/admin/clinics/clinics.component';
import { AdminAuditLogsComponent } from './features/admin/audit-logs/audit-logs.component';
import { AdminComplaintsComponent } from './features/admin/complaints/complaints.component';
import { AdminStatisticsComponent } from './features/admin/statistics/statistics.component';
import { AdminSettingsComponent } from './features/admin/settings/settings.component';

export const routes: Routes = [
  // Public & Guest Routes
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
      { path: 'verify-account', component: VerifyAccountComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
      { path: 'reset-password', component: ResetPasswordComponent }
    ]
  },

  // Patient Portal Routes
  {
    path: 'patient',
    component: PatientLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [ROLES.PATIENT, ROLES.CLINIC_ADMIN, ROLES.RECEPTIONIST, ROLES.SYSTEM_ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: PatientDashboardComponent },
      { path: 'appointments', component: PatientAppointmentsComponent },
      { path: 'doctors', component: PatientDoctorsComponent },
      { path: 'doctors/:id', component: DoctorDetailsComponent },
      { path: 'medical-records', component: MedicalRecordsComponent },
      { path: 'prescriptions', component: PatientPrescriptionsComponent },
      { path: 'documents', component: PatientDocumentsComponent },
      { path: 'consent', component: PatientConsentComponent },
      { path: 'notifications', component: PatientNotificationsComponent },
      { path: 'chat', component: PatientChatComponent },
      { path: 'profile', component: PatientProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },

  // Doctor Portal Routes
  {
    path: 'doctor',
    component: DoctorLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [ROLES.DOCTOR, ROLES.SYSTEM_ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'appointments', component: DoctorAppointmentsComponent },
      { path: 'patients', component: DoctorPatientsComponent },
      { path: 'encounters', component: DoctorEncountersComponent },
      { path: 'prescriptions', component: DoctorPrescriptionsComponent },
      { path: 'schedule', component: DoctorScheduleComponent },
      { path: 'follow-ups', component: DoctorFollowUpsComponent },
      { path: 'chat', component: DoctorChatComponent },
      { path: 'profile', component: DoctorProfileComponent },
      { path: 'settings', component: DoctorSettingsComponent }
    ]
  },

  // Admin Portal Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [ROLES.SYSTEM_ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'doctor-verification', component: DoctorVerificationComponent },
      { path: 'clinics', component: AdminClinicsComponent },
      { path: 'audit-logs', component: AdminAuditLogsComponent },
      { path: 'complaints', component: AdminComplaintsComponent },
      { path: 'statistics', component: AdminStatisticsComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  },

  // Wildcard fallback
  {
    path: '**',
    redirectTo: ''
  }
];
