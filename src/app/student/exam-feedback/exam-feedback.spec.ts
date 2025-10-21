import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamFeedback } from './exam-feedback';

describe('ExamFeedback', () => {
  let component: ExamFeedback;
  let fixture: ComponentFixture<ExamFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
