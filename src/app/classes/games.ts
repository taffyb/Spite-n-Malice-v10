import {EventEmitter} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';

import {SMUtils, ICardModel,IGameModel, IMoveModel, GameFactory as libGameFactory, Game as libGame, IPlayerModel} from 's-n-m-lib';
import {MoveTypesEnum , GameStatesEnum, PositionsEnum} from 's-n-m-lib';


export class Game extends libGame{
    stats:{players:{turns:number,moves:number}[]}={players:[{turns:0,moves:0},{turns:0,moves:0}]};
    stateEmitter$:Subscriber<GameStatesEnum>;  
    players:IPlayerModel[];
    lastMoveId:number=0;
    private constructor(){super();}
    
    static fromModel(model:any):Game{
        const g:Game=new Game();
        g.local = model.local;
        g.uuid = model.uuid;
        g.name= model.name;
        g.player1Uuid=model.player1Uuid;
        g.player2Uuid=model.player2Uuid;
        g.activePlayer=model.activePlayer;
        g.state=model.state;
        g.cards=model.cards;
        g.createDateTime = model.createDateTime;
        return g;        
    }
    onStateChange$():Observable<GameStatesEnum>{
        const o=new Observable<GameStatesEnum>(e => this.stateEmitter$ = e);
        return o;
    }
    
    applyMove(move: IMoveModel) {
        console.log(`game.perfromMove[${MoveTypesEnum[move.type]}]:${JSON.stringify(move)}`);
        if(move.type==MoveTypesEnum.PLAYER){
            let stats=this.stats.players[this.activePlayer];
            stats.moves+=1;
        }
        if(move.id>this.lastMoveId){
            super.applyMove(move);
            this.lastMoveId=move.id;
        }
        if(this.cards[PositionsEnum.PLAYER_PILE+(this.activePlayer*10)].length==0){
            this.state= GameStatesEnum.GAME_OVER;
            this.stateEmitter$.next(this.state);
        }
        // if(this.cards[PositionsEnum.DECK].length==0){
        //     this.state=GameStatesEnum.DRAW;
        //     this.stateEmitter.next(this.state);
        // }
    }

    switchPlayer(){
        let stats=this.stats.players[this.activePlayer];
        stats.turns+=1;
        super.switchPlayer();
    }

    outOfCards(){
        console.log(`Out Of Cards`);
        this.stateEmitter$.next(GameStatesEnum.DRAW);
        this.state= GameStatesEnum.DRAW;
    }
    toModel():IGameModel{
        const model:IGameModel = new libGame();
        model.uuid = this.uuid;
        model.name=this.name;
        model.player1Uuid=this.player1Uuid;
        model.player2Uuid=this.player2Uuid;
        model.activePlayer=this.activePlayer;
        model.createDateTime=this.createDateTime;
        model.state=this.state;
        model.cards=this.cards;
        
        return model;
    }
}
export class GameFactory extends libGameFactory{
    constructor(){
        super();
    }
    static newGame(name:string, player1Uuid: string, player2Uuid: string,deck:number[],debug=false):IGameModel{
        const game= super.newGame(name,player1Uuid,player2Uuid,deck,debug);
        return game
    }
}
export {IGameModel} 

