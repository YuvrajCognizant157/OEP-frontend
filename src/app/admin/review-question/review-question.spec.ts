import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewQuestionComponent } from './review-question';

describe('ReviewQuestion', () => {
  let component: ReviewQuestionComponent;
  let fixture: ComponentFixture<ReviewQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
