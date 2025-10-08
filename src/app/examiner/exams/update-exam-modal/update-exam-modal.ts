import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExaminerService } from '../../../core/services/examiner.service';
import { TopicsService } from '../../../core/services/topics.service';
@Component({
  selector: 'app-update-exam-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-exam-modal.html',
  styleUrl: './update-exam-modal.css'
})
export class UpdateExamModal implements OnChanges, OnInit {
  @Input() examData: any; // Full exam data fetched from GetExamByIdForExaminerAction
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<boolean>(); // Emits true on successful update
  @Output() examUpdated = new EventEmitter<void>(); // Event to refresh the list

  updateForm!: FormGroup;
  topics = signal<any[]>([]); // To hold all available topics
  
  // Status flags
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private examinerService: ExaminerService,
    private topicService : TopicsService
  ) {}
  
  ngOnInit(): void {
    // Initialize form structure
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      totalQuestions: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required, Validators.min(0.5)]],
      tids: [[]], // Currently selected Tids
      displayedQuestions: [null],
      marksPerQuestion: [null, [Validators.required, Validators.min(1)]]
    });

    // Fetch topics once
    this.topicService.getTopics().subscribe({
      next: (data) => this.topics.set(data),
      error: (err) => console.error('Error loading topics for update form:', err)
    });
  }

  // Triggered when @Input() examData changes (when modal opens)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['examData'] && this.examData && this.updateForm) {
      this.patchFormValues();
    }
  }

  private patchFormValues(): void {
    this.errorMessage.set(null); // Clear previous errors
    
    // Deserialize Tids string into array of numbers/strings (assuming it was stored as JSON string)
    let currentTids: (number | string)[] = [];
    try {
      // NOTE: Based on the C# model, Tids is saved as a JSON string.
      // We assume it contains a List<int> of topic IDs.
      const parsedTids = JSON.parse(this.examData.tids);
      currentTids = Array.isArray(parsedTids) ? parsedTids : [];
    } catch (e) {
      console.warn('Could not parse Tids string:', this.examData.tids);
    }

    this.updateForm.patchValue({
      name: this.examData.examName,
      description: this.examData.description,
      totalQuestions: this.examData.totalQuestions,
      duration: this.examData.duration,
      // Note: Tids is handled separately to manage checkbox state
      displayedQuestions: this.examData.displayedQuestions,
      marksPerQuestion: this.examData.marksPerQuestion
    });
    
    // Manually set Tids array after parsing
    this.updateForm.get('tids')?.setValue(currentTids.map(id => +id));
  }

  onTopicChange(event: any, topicId: number): void {
    const tidsControl = this.updateForm.get('tids');
    let tids = tidsControl?.value as number[];
    topicId = +topicId; // Ensure ID is a number

    if (event.target.checked) {
      if (!tids.includes(topicId)) {
        tids.push(topicId);
      }
    } else {
      tids = tids.filter(id => id !== topicId);
    }
    tidsControl?.setValue(tids);
  }

  isTopicSelected(topicId: number): boolean {
    const tids = this.updateForm?.get('tids')?.value;
    return Array.isArray(tids) && tids.includes(topicId);
  }

  onUpdate(): void {
    if (this.updateForm.invalid) {
      this.errorMessage.set('Please fill out all required fields correctly.');
      return;
    }

    this.isLoading.set(true);
    const formValue = this.updateForm.value;
    const examId = this.examData.eid;

    const payload = {
      ...formValue,
      tids: formValue.tids.map((id: number) => id.toString())
    };

    this.examinerService.updateExam(examId, payload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.examUpdated.emit();
        this.onClose();
        console.log('Update successful:', response);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Update failed:', error.error);
        alert(error.error);
        
        // Handle specific error code for approval status
        const errorMsg = error.error || error.statusText;
        if (errorMsg.includes('submitted for approval')) {
             this.errorMessage.set('This exam has been submitted for approval and cannot be updated.');
        } else {
             this.errorMessage.set('Update failed. Server Error.');
        }
      }
    });
  }

  onClose(): void {
    this.isOpen = false;
    this.updateForm.reset();
    this.closeModal.emit(false); // Emit false to indicate no refresh needed if canceled
  }

  // To close the modal when clicking outside of it
  onModalClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('update-modal-overlay')) {
      this.onClose();
    }
  }
}
