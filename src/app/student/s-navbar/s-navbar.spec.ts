import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SNavbar } from './s-navbar';

describe('SNavbar', () => {
  let component: SNavbar;
  let fixture: ComponentFixture<SNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
