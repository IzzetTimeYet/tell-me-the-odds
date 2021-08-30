import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistSetComponent } from './wishlist-set.component';

describe('WishlistSetComponent', () => {
  let component: WishlistSetComponent;
  let fixture: ComponentFixture<WishlistSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
