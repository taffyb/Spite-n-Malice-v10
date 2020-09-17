import { Component, OnInit, Input } from '@angular/core';

import {IGameModel, PositionsEnum, SMUtils, ICardModel} from 's-n-m-lib';
@Component({
  selector: 'app-game-explorer',
  templateUrl: './game-explorer.component.html',
  styleUrls: ['./game-explorer.component.css']
})
export class GameExplorerComponent implements OnInit {
  @Input()game:IGameModel;
  PE=PositionsEnum;

  constructor() { }

  ngOnInit(): void {
  }
  cardsAsList(cards:ICardModel[]):string{
    let list:string = '[';
    cards.forEach((c,i)=>{
      list+= this.cardAsString(c.cardNo);
      if(i<cards.length-1){
        list+=', ';
      }
    });
    list+=']';
    return list;
  }
  cardAsString(cardNo:number):string{
    return cardNo+'/'+SMUtils.toFaceNumber(cardNo);
  }
  totalCardsInPlay():number{
    let count:number =0;
    this.game.cards.forEach ((c:ICardModel[])=>{
      count+=c.length;
    });
    return count;
  }
  countCards(cardNo:number):number{
    let count:number=0;
    this.game.cards.forEach((pile:ICardModel[],i)=>{
      pile.forEach((card:ICardModel,j)=>{
        if(SMUtils.toFaceNumber(card.cardNo) == cardNo){
          count++;
        }
      });        
    });
    return count;
  }
}
