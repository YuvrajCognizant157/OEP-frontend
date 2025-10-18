import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemarkDialog } from './add-remark-dialog';

describe('AddRemarkDialog', () => {
  let component: AddRemarkDialog;
  let fixture: ComponentFixture<AddRemarkDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRemarkDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRemarkDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
