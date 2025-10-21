import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuestions } from './manage-questions';

describe('ManageQuestions', () => {
  let component: ManageQuestions;
  let fixture: ComponentFixture<ManageQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
