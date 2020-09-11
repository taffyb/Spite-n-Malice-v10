import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveRptComponent } from './move-rpt.component';

describe('MoveRptComponent', () => {
  let component: MoveRptComponent;
  let fixture: ComponentFixture<MoveRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
