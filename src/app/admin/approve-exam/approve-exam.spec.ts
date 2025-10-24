import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveExamComponent } from './approve-exam';

describe('ApproveExam', () => {
  let component: ApproveExamComponent;
  let fixture: ComponentFixture<ApproveExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
