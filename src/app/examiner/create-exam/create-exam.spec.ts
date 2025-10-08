import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExam } from './create-exam';

describe('CreateExam', () => {
  let component: CreateExam;
  let fixture: ComponentFixture<CreateExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
