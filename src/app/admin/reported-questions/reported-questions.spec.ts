import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedQuestions } from './reported-questions';

describe('ReportedQuestions', () => {
  let component: ReportedQuestions;
  let fixture: ComponentFixture<ReportedQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportedQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportedQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
