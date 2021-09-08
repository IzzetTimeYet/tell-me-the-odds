import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistOddsComponent } from './wishlist-odds.component';

describe('WishlistOddsComponent', () => {
  let component: WishlistOddsComponent;
  let fixture: ComponentFixture<WishlistOddsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistOddsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistOddsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
