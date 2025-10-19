import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewQuestion } from './review-question';

describe('ReviewQuestion', () => {
  let component: ReviewQuestion;
  let fixture: ComponentFixture<ReviewQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewQuestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
