import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactWishlistComponent } from './artifact-wishlist.component';

describe('ArtifactWishlistComponent', () => {
  let component: ArtifactWishlistComponent;
  let fixture: ComponentFixture<ArtifactWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtifactWishlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
