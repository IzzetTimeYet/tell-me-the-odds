import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistAnalysisComponent } from './wishlist-analysis.component';

describe('WishlistAnalysisComponent', () => {
  let component: WishlistAnalysisComponent;
  let fixture: ComponentFixture<WishlistAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
