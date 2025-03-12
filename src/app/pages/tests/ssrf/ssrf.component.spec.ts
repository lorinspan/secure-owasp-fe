import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SSRFComponent } from './ssrf.component';

describe('SSRFComponent', () => {
  let component: SSRFComponent;
  let fixture: ComponentFixture<SSRFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SSRFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SSRFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
