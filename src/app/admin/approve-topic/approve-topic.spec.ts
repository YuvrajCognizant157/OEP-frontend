import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveTopic } from './approve-topic';

describe('ApproveTopic', () => {
  let component: ApproveTopic;
  let fixture: ComponentFixture<ApproveTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveTopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveTopic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
