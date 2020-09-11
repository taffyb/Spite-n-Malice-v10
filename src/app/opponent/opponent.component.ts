import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Opponent,IPlayerModel,IGameModel} from 's-n-m-lib';
import { Observable,Observer,of } from 'rxjs';
import {GameService} from '../services/game.service';

@Component({
  selector: 'app-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.css']
})
export class OpponentComponent implements OnInit {
  @Input()player:IPlayerModel;
  @Input()opponent:Opponent;
  @Output()onInvite:EventEmitter<IPlayerModel> = new EventEmitter<IPlayerModel>();
  activeGames$:Observable<IGameModel>;
  
  constructor(private gameSvc:GameService) { 
      
  }

  ngOnInit() {
      
  }
  newGameWith(){
      this.onInvite.emit(this.opponent);
  }
}
