import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamFeedbackComponent } from './exam-feedback';

describe('ExamFeedback', () => {
  let component: ExamFeedbackComponent;
  let fixture: ComponentFixture<ExamFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
