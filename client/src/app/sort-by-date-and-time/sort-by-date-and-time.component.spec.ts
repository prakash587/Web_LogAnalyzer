import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortByDateAndTimeComponent } from './sort-by-date-and-time.component';

describe('SortByDateAndTimeComponent', () => {
  let component: SortByDateAndTimeComponent;
  let fixture: ComponentFixture<SortByDateAndTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortByDateAndTimeComponent]
    });
    fixture = TestBed.createComponent(SortByDateAndTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
