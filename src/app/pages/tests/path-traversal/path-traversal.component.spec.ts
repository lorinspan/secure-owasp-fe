import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathTraversalComponent } from './path-traversal.component';

describe('PathTraversalComponent', () => {
  let component: PathTraversalComponent;
  let fixture: ComponentFixture<PathTraversalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathTraversalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathTraversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
