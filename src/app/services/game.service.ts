import {IGameModel, GameFactory, Game} from '../classes/games';
import {ICardModel, Card, IPlayerModel} from 's-n-m-lib';
import {PositionsEnum, CardsEnum,GameStatesEnum} from 's-n-m-lib';
import {DealerService} from './dealer.service';
import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import * as common from './service.common';

@Injectable({
  providedIn: 'root',
})
export class GameService{
    _games={};
    statusChanged: Subject<{status:GameStatesEnum, game: IGameModel}> = new Subject<{status:GameStatesEnum, game: IGameModel}>();
    constructor(private http:HttpClient, 
                private dealerSvc:DealerService){
        console.log(`GameService.constructor`);
    }
//    getGame(gameUuid:string):Game{
//        if(!this._games[gameUuid]){
//            throw new Error();
//        }
//        return this._games[gameUuid];
//    }
    getGame$(gameUuid:string):Observable<Game>{
        let o:Observable<Game>;
        let self=this;
        console.log(`getGame$: ${gameUuid}`);
        return new Observable<Game>(subscriber => {
            if(!this._games[gameUuid]){   
                const url = `${common.endpoint}games/${gameUuid}`;
                console.log(`getGame$.url: ${url}`);
                this.http.get<IGameModel>(url).subscribe({
                    next(g:IGameModel) { 
                        const game:Game= Game.fromModel(g); 
                        subscriber.next(game);
                        subscriber.complete();
                    },
                    error(err) { console.error(`Error calling ${url}: ${JSON.stringify(err)}`); }
                  });
            }else{
                console.log(`getGame$ get from cache`);
                subscriber.next(this._games[gameUuid]);
                subscriber.complete();
            }           
        });
    }
    getGames$(playerUuid?:string,limit?:number):Observable<IGameModel[]>{
        const url = `${common.endpoint}games?${playerUuid?'playerUuid='+playerUuid:''}&${limit?'limit='+limit:''}`;
//        console.log(`getGames$: ${url}`);
        return this.http.get<IGameModel[]>(url);
    }
    getGamesWith$(player:IPlayerModel,opponent:IPlayerModel):Observable<IGameModel[]>{
        const url = `${common.endpoint}games?${player.uuid?'playerUuid='+player.uuid:''}&opponent=${opponent.uuid}`;
        return this.http.get<IGameModel[]>(url);
    }
    newGame(name:string,player1Uuid:string,player2Uuid:string,local:boolean):Game{
        const deck:number[] = this.dealerSvc.getDeck();
        const g:IGameModel=GameFactory.newGame(name,player1Uuid, player2Uuid,deck,local);
        const game:Game=Game.fromModel(g);
        this._games[game.uuid]=game;
        this.statusChanged.next({status: GameStatesEnum.NEW, game: game});
        this.saveGame(game);
        return game;
    }
    saveGame(game:IGameModel){
        
        this.http.post<IGameModel>(`${common.endpoint}games`,game).subscribe(
                (val) => {
                    console.log(`saveGame Success [${game.uuid}]`);
                },
                response => {
                    if(response.status===0){
                        console.error("Server Unavailable");
                    }else{
                        console.error("Error Saving Game", response);
                    }
                });
    }
    updateGame(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        this.http.put<boolean>(`${common.endpoint}games/${game.uuid}?activePlayer=true`,game).subscribe(
                (val) => {
                    console.log(`updateGame Success`);
                },
                response => {
                    console.error("Error Updating Game", response);
                });
    }
    updateGameName(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        this.http.put<boolean>(`${common.endpoint}games/${game.uuid}?name=true`,game).subscribe(
                (val) => {
                    console.log(`updateName Success`);
                },
                response => {
                    console.error("Error Updating Game Name", response);
                });
    }
    updateGameState(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        this.http.put<boolean>(`${common.endpoint}games/${game.uuid}?state=true`,game).subscribe(
                (val) => {
                    console.log(`updateState[${GameStatesEnum[game.state]}] Success`);
                },
                response => {
                    console.error("Error Updating Game State", response);
                });
    }
    setGame(gameUuid:string,cards:ICardModel[][]){
        this._games[gameUuid].cards=cards;
    }
}