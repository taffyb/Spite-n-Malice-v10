import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import {Options} from '../classes/options';
import {SelectedCard} from '../classes/selected-card'
import {SMUtils, Card} from 's-n-m-lib';
import {CardsEnum} from 's-n-m-lib';

@Component({
  selector: 'app-game-pile',
  templateUrl: './game-pile.component.html',
  styleUrls: ['./game-pile.component.css']
})
export class GamePileComponent implements OnInit {
  cardsEnum:CardsEnum;
  @Input()pos:number;
  @Input()cards:Card[];
  @Input()options:Options;
  @Output()onSelect:EventEmitter<SelectedCard> = new EventEmitter<SelectedCard>();

  constructor() { }

  ngOnInit() {
  }

  select(selectedCard:SelectedCard){
//      console.log(`Game-pile-selected Card: ${JSON.stringify(selectedCard)}`);
      this.onSelect.emit(selectedCard);
  }
  getFaceNumber(depth:number):number{
      return SMUtils.getFaceNumber(this.cards, depth);
  }
}
