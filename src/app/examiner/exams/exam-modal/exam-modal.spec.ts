import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamModal } from './exam-modal';

describe('ExamModal', () => {
  let component: ExamModal;
  let fixture: ComponentFixture<ExamModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
