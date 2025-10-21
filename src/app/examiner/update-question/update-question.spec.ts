import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuestion } from './update-question';

describe('UpdateQuestion', () => {
  let component: UpdateQuestion;
  let fixture: ComponentFixture<UpdateQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
