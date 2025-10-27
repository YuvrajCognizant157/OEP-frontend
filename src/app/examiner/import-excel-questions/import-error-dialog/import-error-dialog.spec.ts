import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportErrorDialog } from './import-error-dialog';

describe('ImportErrorDialog', () => {
  let component: ImportErrorDialog;
  let fixture: ComponentFixture<ImportErrorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportErrorDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportErrorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
