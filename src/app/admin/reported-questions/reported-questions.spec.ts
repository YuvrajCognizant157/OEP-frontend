import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedQuestionsComponent } from './reported-questions';

describe('ReportedQuestions', () => {
  let component: ReportedQuestionsComponent;
  let fixture: ComponentFixture<ReportedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportedQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
