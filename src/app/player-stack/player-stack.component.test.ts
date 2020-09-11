import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; 
import { MaterialModules } from '../material-module';
import {Options} from '../classes/options';

import { PlayerStackComponent } from './player-stack.component';

describe('PlayerStackComponent', () => {
  let component: PlayerStackComponent;
  let fixture: ComponentFixture<PlayerStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [
              /*Options,*/
              HttpClientModule,
              MaterialModules/*,
              RouterTestingModule*/
            ],
      declarations: [ Options,PlayerStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
