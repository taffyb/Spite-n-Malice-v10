import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import {Options} from '../classes/options';
import {SelectedCard} from '../classes/selected-card'
import {Card} from 's-n-m-lib';

@Component({
  selector: 'app-pile',
  templateUrl: './pile.component.html',
  styleUrls: ['./pile.component.css']
})
export class PileComponent implements OnInit {
  @Input()pos:number;
  @Input()cards:Card[];
  @Input()options:Options;
  @Output()onSelect:EventEmitter<SelectedCard> = new EventEmitter<SelectedCard>();

  constructor() { }

  ngOnInit() {
  }

  select(selectedCard:SelectedCard){
//      console.log(`Pile-selected Card: ${JSON.stringify(selectedCard)}`);
      this.onSelect.emit(selectedCard);
  }
}
