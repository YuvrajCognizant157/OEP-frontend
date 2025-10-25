import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SFeedback } from './s-feedback';

describe('SFeedback', () => {
  let component: SFeedback;
  let fixture: ComponentFixture<SFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
