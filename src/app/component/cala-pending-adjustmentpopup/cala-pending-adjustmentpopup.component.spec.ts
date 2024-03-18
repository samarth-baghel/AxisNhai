import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalaPendingAdjustmentpopupComponent } from './cala-pending-adjustmentpopup.component';

describe('CalaPendingAdjustmentpopupComponent', () => {
  let component: CalaPendingAdjustmentpopupComponent;
  let fixture: ComponentFixture<CalaPendingAdjustmentpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalaPendingAdjustmentpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalaPendingAdjustmentpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
