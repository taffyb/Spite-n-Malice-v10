import {Injectable} from '@angular/core';
import {Game} from '../classes/games';
import {IMoveModel,Dealer} from 's-n-m-lib';

import {MoveService} from '../services/move.service';

@Injectable({
  providedIn: 'root'
})
export class DealerService extends Dealer{
  private dealer:Dealer = new Dealer();
  
  constructor(private moveSvc: MoveService) {super();}
  
  fillHand(activePlayer: number, game: Game): IMoveModel[]{
    console.log(`DealerService.fillHand`);
    let moves:IMoveModel[] = [];
    moves=super.fillHand(activePlayer,game);

    const addMove = new Promise((resolve,reject)=>{
        this.moveSvc.addMoves(game,"", moves);
    });
    return moves;
  }
}