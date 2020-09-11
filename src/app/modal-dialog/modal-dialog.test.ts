import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDialog } from './modal-dialog';

describe('DialogModalExampleComponent', () => {
  let component: ModalDialog;
  let fixture: ComponentFixture<ModalDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
