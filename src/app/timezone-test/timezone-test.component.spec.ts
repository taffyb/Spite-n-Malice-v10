import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneTestComponent } from './timezone-test.component';

describe('ReportComponent', () => {
  let component: TimezoneTestComponent;
  let fixture: ComponentFixture<TimezoneTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimezoneTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
