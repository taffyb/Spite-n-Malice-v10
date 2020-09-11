import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import {Options} from '../classes/options';
import {SelectedCard} from '../classes/selected-card'

@Component({
  selector: 'app-player-stack',
  templateUrl: './player-stack.component.html',
  styleUrls: ['./player-stack.component.css']
})
export class PlayerStackComponent implements OnInit {
  @Input()pos:number;
  @Input()cards:number[];
  @Input()options:Options;
  @Output()onSelect:EventEmitter<SelectedCard> = new EventEmitter<SelectedCard>();
  
  constructor() { }

  ngOnInit() {
  }
  select(selectedCard:SelectedCard){
//      console.log(`Stack-selected Card: ${JSON.stringify(selectedCard)}`);
      this.onSelect.emit(selectedCard);
  }
}
