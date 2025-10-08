import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExamModal } from './update-exam-modal';

describe('UpdateExamModal', () => {
  let component: UpdateExamModal;
  let fixture: ComponentFixture<UpdateExamModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateExamModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateExamModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
