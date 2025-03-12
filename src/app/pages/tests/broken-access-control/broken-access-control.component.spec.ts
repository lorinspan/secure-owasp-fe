import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokenAccessControlComponent } from './broken-access-control.component';

describe('SqlInjectionComponent', () => {
  let component: BrokenAccessControlComponent;
  let fixture: ComponentFixture<BrokenAccessControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokenAccessControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokenAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
