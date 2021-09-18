import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactResinComponent } from './artifact-resin.component';

describe('ArtifactResinComponent', () => {
  let component: ArtifactResinComponent;
  let fixture: ComponentFixture<ArtifactResinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtifactResinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactResinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
