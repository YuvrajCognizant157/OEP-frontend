import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUserComponent } from './block-user';

describe('BlockUser', () => {
  let component: BlockUserComponent;
  let fixture: ComponentFixture<BlockUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
