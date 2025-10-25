import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelQuestions } from './import-excel-questions';

describe('ImportExcelQuestions', () => {
  let component: ImportExcelQuestions;
  let fixture: ComponentFixture<ImportExcelQuestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportExcelQuestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExcelQuestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
