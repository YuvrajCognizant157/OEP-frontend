import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-modal',
  imports: [
    CommonModule,
  ],
  templateUrl: './exam-modal.html',
  styleUrl: './exam-modal.css',
})
export class ExamModal {
  @Input() exam: any;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  // To close the modal when clicking outside of it
  onModalClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}
