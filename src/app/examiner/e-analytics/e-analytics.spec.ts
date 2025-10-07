import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EAnalytics } from './e-analytics';

describe('EAnalytics', () => {
  let component: EAnalytics;
  let fixture: ComponentFixture<EAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
