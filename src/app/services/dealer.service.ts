import {Injectable} from '@angular/core';
import {Game} from '../classes/games';
import {IMoveModel, Move, ICardModel, Card, Dealer} from 's-n-m-lib';
import {PositionsEnum, CardsEnum, PlayerPositionsEnum, MoveTypesEnum} from 's-n-m-lib';

import {MoveService} from '../services/move.service';

@Injectable({
  providedIn: 'root'
})
export class DealerService extends Dealer{

  constructor(private moveSvc:MoveService) {super();}
  
  fillHand(activePlayer:number,game:Game):Move[]{
      console.log(`DealerService.fillHand`);
      let moves:Move[]=[];
      moves=super.fillHand(activePlayer,game);

      const addMove = new Promise((resolve,reject)=>{
          this.moveSvc.addMoves(game,"", moves);
      });
      return moves;
  }
}