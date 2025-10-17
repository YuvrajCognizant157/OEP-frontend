import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveQuestion } from './approve-question';

describe('ApproveQuestion', () => {
  let component: ApproveQuestion;
  let fixture: ComponentFixture<ApproveQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveQuestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
