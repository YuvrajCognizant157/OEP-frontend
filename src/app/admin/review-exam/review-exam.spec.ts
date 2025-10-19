import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewExam } from './review-exam';

describe('ReviewExam', () => {
  let component: ReviewExam;
  let fixture: ComponentFixture<ReviewExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
