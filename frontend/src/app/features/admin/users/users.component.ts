import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { PaginationMeta } from '../../../core/models/api-response.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DateFormatPipe, 
    SearchBarComponent, 
    PaginationComponent, 
    ModalComponent, 
    ConfirmDialogComponent,
    PageHeaderComponent,
    IconComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  paginationMeta?: PaginationMeta;
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Filters
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  currentPage = 1;

  // Modals & Actions
  selectedUser: User | null = null;
  isDetailsModalOpen = false;
  isEditModalOpen = false;
  isSaving = false;

  // Edit fields
  editRole = '';
  editStatus = '';
  editIsVerified = false;

  // Confirm dialog
  isConfirmOpen = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmIsDanger = false;
  confirmAction: (() => void) | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true;
    this.errorMessage = null;

    const params: any = {
      page: this.currentPage,
      limit: 10
    };
    if (this.searchTerm.trim()) params.search = this.searchTerm.trim();
    if (this.selectedRole) params.role = this.selectedRole;
    if (this.selectedStatus) params.status = this.selectedStatus;

    this.userService.getUsers(params).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.users = res.data || [];
          this.paginationMeta = res.meta;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to load users directory.';
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.loadUsers(1);
  }

  onFilterChange(): void {
    this.loadUsers(1);
  }

  openDetails(user: User): void {
    this.selectedUser = user;
    this.isDetailsModalOpen = true;
  }

  openEdit(user: User): void {
    this.selectedUser = user;
    this.editRole = user.role;
    this.editStatus = user.status;
    this.editIsVerified = user.isVerified;
    this.isEditModalOpen = true;
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;
    this.isSaving = true;

    const updatePayload: any = {
      role: this.editRole,
      status: this.editStatus,
      isVerified: this.editIsVerified
    };

    this.userService.updateUserByAdmin(this.selectedUser._id, updatePayload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.isEditModalOpen = false;
        this.successMessage = 'User updated successfully.';
        this.loadUsers(this.currentPage);
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.message || 'Failed to update user.';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  deleteUser(user: User): void {
    this.confirmTitle = 'Deactivate User Account';
    this.confirmMessage = `Are you sure you want to soft-delete ${user.firstName} ${user.lastName}?`;
    this.confirmIsDanger = true;
    this.confirmAction = () => {
      this.userService.deleteUserByAdmin(user._id).subscribe({
        next: () => {
          this.isConfirmOpen = false;
          this.successMessage = 'User account deactivated.';
          this.loadUsers(this.currentPage);
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.isConfirmOpen = false;
          this.errorMessage = err.message || 'Failed to deactivate user.';
        }
      });
    };
    this.isConfirmOpen = true;
  }

  restoreUser(user: User): void {
    this.confirmTitle = 'Restore User Account';
    this.confirmMessage = `Restore account access for ${user.firstName} ${user.lastName}?`;
    this.confirmIsDanger = false;
    this.confirmAction = () => {
      this.userService.restoreUserByAdmin(user._id).subscribe({
        next: () => {
          this.isConfirmOpen = false;
          this.successMessage = 'User account restored to ACTIVE.';
          this.loadUsers(this.currentPage);
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.isConfirmOpen = false;
          this.errorMessage = err.message || 'Failed to restore user.';
        }
      });
    };
    this.isConfirmOpen = true;
  }

  onConfirm(): void {
    if (this.confirmAction) {
      this.confirmAction();
    }
  }
}
