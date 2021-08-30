import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistArtifactComponent } from './wishlist-artifact.component';

describe('WishlistArtifactComponent', () => {
  let component: WishlistArtifactComponent;
  let fixture: ComponentFixture<WishlistArtifactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistArtifactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
