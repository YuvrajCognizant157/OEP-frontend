import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartExam } from './start-exam';

describe('StartExam', () => {
  let component: StartExam;
  let fixture: ComponentFixture<StartExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartExam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
