import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAreaComponent } from './play-area.component';

describe('PlayAreaComponent', () => {
  let component: PlayAreaComponent;
  let fixture: ComponentFixture<PlayAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
