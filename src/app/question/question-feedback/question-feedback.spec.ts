import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFeedback } from './question-feedback';

describe('QuestionFeedback', () => {
  let component: QuestionFeedback;
  let fixture: ComponentFixture<QuestionFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
