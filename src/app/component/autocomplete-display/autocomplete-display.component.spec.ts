import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteDisplayComponent } from './autocomplete-display.component';

describe('AutocompleteDisplayComponent', () => {
  let component: AutocompleteDisplayComponent;
  let fixture: ComponentFixture<AutocompleteDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
