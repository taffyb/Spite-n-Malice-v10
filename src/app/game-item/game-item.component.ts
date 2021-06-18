import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import {IGameModel, IPlayerModel, GameStatesEnum} from 's-n-m-lib';
import {PlayerService} from '../services/player.service';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.css']
})
export class GameItemComponent implements OnInit {
  @Input()game:IGameModel;
  gameStatesEnum = GameStatesEnum;
  constructor( 
          private router: Router,
          private playerSvc:PlayerService) { }

  ngOnInit() {
  }

  isMyTurn():boolean{
      const me:IPlayerModel = this.playerSvc.getActivePlayer();
      const playersUuids:string[] = [this.game.player1Uuid,this.game.player2Uuid];
      
      return (playersUuids[this.game.activePlayer] === me.uuid);
  }

  openGame(uuid){
    const url:string = `/play-area/${uuid}`;
    this.router.navigate([url]);
  }
}
