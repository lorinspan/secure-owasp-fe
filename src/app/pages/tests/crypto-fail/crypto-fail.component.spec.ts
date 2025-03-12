import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoFailComponent } from './crypto-fail.component';

describe('CryptoFailComponent', () => {
  let component: CryptoFailComponent;
  let fixture: ComponentFixture<CryptoFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoFailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
