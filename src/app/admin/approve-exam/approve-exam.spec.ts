import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveExam } from './approve-exam';

describe('ApproveExam', () => {
  let component: ApproveExam;
  let fixture: ComponentFixture<ApproveExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
