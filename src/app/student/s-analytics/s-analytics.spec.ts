import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SAnalytics } from './s-analytics';

describe('SAnalytics', () => {
  let component: SAnalytics;
  let fixture: ComponentFixture<SAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
