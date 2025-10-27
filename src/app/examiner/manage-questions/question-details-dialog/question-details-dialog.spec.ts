import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDetailsDialog } from './question-details-dialog';

describe('QuestionDetailsDialog', () => {
  let component: QuestionDetailsDialog;
  let fixture: ComponentFixture<QuestionDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
