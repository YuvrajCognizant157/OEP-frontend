import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exam } from '../exams';
import { MatChipSet, MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-exam-modal',
  imports: [
    CommonModule,
    MatChipSet, MatChip 
  ],
  templateUrl: './exam-modal.html',
  styleUrl: './exam-modal.css',
})
export class ExamModal {
  @Input() exam: Exam | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  getApprovalStatus(status: number, approval: boolean): { text: string; class: string } {
    if (status === 1) return { text: 'Approved', class: 'status-approved' };
    if (status === 0 && approval === true)
      return { text: 'Submitted For Approval', class: 'status-awaited' };
    if (status === 0) return { text: 'Pending', class: 'status-pending' };
    return { text: 'Rejected', class: 'status-rejected' };
  }

  // To close the modal when clicking outside of it
  onModalClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}
