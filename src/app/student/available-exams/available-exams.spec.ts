import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableExams } from './available-exams';

describe('AvailableExams', () => {
  let component: AvailableExams;
  let fixture: ComponentFixture<AvailableExams>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableExams]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableExams);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
