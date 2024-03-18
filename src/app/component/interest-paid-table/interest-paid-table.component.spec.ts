import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestPaidTableComponent } from './interest-paid-table.component';

describe('InterestPaidTableComponent', () => {
  let component: InterestPaidTableComponent;
  let fixture: ComponentFixture<InterestPaidTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestPaidTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestPaidTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
