import { Component, Input, Output, EventEmitter, OnInit, signal, SimpleChanges } from '@angular/core';
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
export class UpdateExamModal implements OnInit { 

  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() examUpdated = new EventEmitter<void>();

  private _examData: any; // Private variable to hold the data

  /**
   * Use a setter for the Input() to catch data as it arrives
   * and patch the form as soon as it's ready.
   */
  @Input()
  set examData(data: any) {
    if (data) {
      this._examData = data;
      // Only patch the form if it has *already* been initialized
      if (this.updateForm) {
        this.patchFormValues();
      }
    }
  }

  get examData(): any {
    return this._examData;
  }


  updateForm!: FormGroup;
  topics = signal<any[]>([]); // To hold all available topics

  // Status flags
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private examinerService: ExaminerService,
    private topicService: TopicsService
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
    // After the form is created, check if data has already arrived
    // via the input setter. If so, patch the form now.
    if (this.examData) {
      this.patchFormValues();
    }
  }

  private patchFormValues(): void {
    this.errorMessage.set(null); // Clear previous errors

    // Deserialize Tids string into array of numbers/strings
    let currentTids: (number | string)[] = [];
    try {
      // NOTE: Based on the C# model, Tids is saved as a JSON string.
      const parsedTids = JSON.parse(this.examData.tids);
      currentTids = Array.isArray(parsedTids) ? parsedTids : [];
    } catch (e) {
      console.warn('Could not parse Tids string:', this.examData.tids);
      // Fallback: If tids is already an array (e.g., from parent state)
      if (Array.isArray(this.examData.tids)) {
        currentTids = this.examData.tids;
      }
    }

    this.updateForm.patchValue({
      name: this.examData.name,
      description: this.examData.description,
      totalQuestions: this.examData.totalQuestions,
      duration: this.examData.duration,
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
      // Ensure tids are strings for the backend
      tids: formValue.tids.map((id: number) => id.toString()) 
    };
    
    // The C# backend expects a JSON string, not an array of strings.
    // Let's re-serialize it.
    const finalPayload = {
      ...payload
    };


    this.examinerService.updateExam(examId, finalPayload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.examUpdated.emit();
        this.onClose();
        console.log('Update successful:', response);
      },
      error: (error) => {
        this.isLoading.set(false);
        
        // Handle specific error code for approval status
        const errorMsg = error.error?.msg || error.error || error.statusText;
        console.error('Update failed:', errorMsg);

        if (errorMsg.includes('submitted for approval')) {
            this.errorMessage.set('This exam has been submitted for approval and cannot be updated.');
        } else {
            this.errorMessage.set(`Update failed: ${errorMsg}`);
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