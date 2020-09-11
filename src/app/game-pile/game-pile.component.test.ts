import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePileComponent } from './game-pile.component';

describe('GamePileComponent', () => {
  let component: GamePileComponent;
  let fixture: ComponentFixture<GamePileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
