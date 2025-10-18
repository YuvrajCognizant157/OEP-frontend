import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUser } from './block-user';

describe('BlockUser', () => {
  let component: BlockUser;
  let fixture: ComponentFixture<BlockUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
