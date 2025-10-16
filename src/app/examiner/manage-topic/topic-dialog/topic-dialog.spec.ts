import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicDialog } from './topic-dialog';

describe('TopicDialog', () => {
  let component: TopicDialog;
  let fixture: ComponentFixture<TopicDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
