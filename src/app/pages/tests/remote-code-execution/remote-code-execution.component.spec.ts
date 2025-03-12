import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteCodeExecutionComponent } from './remote-code-execution.component';

describe('RemoteCodeExecutionComponent', () => {
  let component: RemoteCodeExecutionComponent;
  let fixture: ComponentFixture<RemoteCodeExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteCodeExecutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoteCodeExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
