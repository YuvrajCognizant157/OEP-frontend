import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTopic } from './manage-topic';

describe('ManageTopic', () => {
  let component: ManageTopic;
  let fixture: ComponentFixture<ManageTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTopic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
