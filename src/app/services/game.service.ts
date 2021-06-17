
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {IGameModel, GameFactory, Game} from '../classes/games';
import {Card, ICardModel, GameStatesEnum} from 's-n-m-lib';
import {DealerService} from './dealer.service';
import {AuthService} from './auth.service';
import * as common from './service.common';
import {Observable, of, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyAuthTypesEnum } from "../classes/auth.enums";

@Injectable({
  providedIn: 'root',
})
export class GameService{
    private _games={};
    statusChanged: Subject<{status:GameStatesEnum, game: IGameModel}> = new Subject<{status:GameStatesEnum, game: IGameModel}>();
    constructor(private http:HttpClient, 
                private dealerSvc:DealerService, 
                private authSvc:AuthService){
        // console.log(`GameService.constructor`);
    }

    getGame$(gameUuid:string):Observable<Game>{
        const result:Subject<Game> = new Subject<Game>();
        console.log(`getGame$: ${gameUuid}`);
        if(this.authSvc.getAuthStatus()==MyAuthTypesEnum.AUTHENTICATED){
            return new Observable<Game>(subscriber => {
                if(!this._games[gameUuid]){   
                    const url = `${common.endpoint}/games/${gameUuid}`;
                    this.authSvc.getAccessJwtToken()
                    .then(token=>{
                        console.log(`token:\n${token}`);
                        const headers= new HttpHeaders().set('Authorization', token);
                        const http$ = this.http.get<Game>(url,{headers:headers});
                        http$.subscribe(g=>{
                            const game:Game = Game.fromModel(this.game2UiGame(Game.fromModel(g)));
                            this._games[gameUuid]=game;
                            this.statusChanged.next({status: GameStatesEnum.NEW, game: game});
                            result.next(game);
                            result.complete();
                        })
                      });
                }else{
                    console.log(`getGame$ get from cache`);
                    result.next(this._games[gameUuid]);
                    result.complete();
                }           
            });
        }else{
            console.log(`getGame$ get from cache`);
            return of(this._games[gameUuid]);
        }
    }
    getGames$(limit?:number):Observable<IGameModel[]>{
        const result:Subject<IGameModel[]> = new Subject<IGameModel[]>();
        const url = `${common.endpoint}/players/games`;
        console.log(`getGames$: ${url}`);
        this.authSvc.getAccessJwtToken()
        .then(token=>{
            console.log(`token:\n${token}`);
            const headers= new HttpHeaders().set('Authorization', token);
            const http$ = this.http.get<IGameModel[]>(url,{headers:headers});
            http$.pipe(
                // tap((games)=>{
                //     console.log(`games ${JSON.stringify(games,null,2)}`);                    
                // })
                
            ).subscribe(res=>{result.next(res)});
        });
        return result;
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
        console.log(`saveGame [${game.uuid}]`);
        this.http.post<IGameModel>(`${common.endpoint}/games`,this.uiGame2Game(game)).subscribe();
    }
    updateGame(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        this.http.put<boolean>(`${common.endpoint}/games/${game.uuid}?activePlayer=true`,this.uiGame2Game(game)).subscribe(
                (val) => {
                    console.log(`updateGame Success`);
                },
                response => {
                    console.error("Error Updating Game", response);
                });
    }
    updateGameName(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        this.http.put<boolean>(`${common.endpoint}/games/${game.uuid}?name=true`,this.uiGame2Game(game)).subscribe(
                (val) => {
                    console.log(`updateName Success`);
                },
                response => {
                    console.error("Error Updating Game Name", response);
                });
    }
    updateGameState(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        this.http.put<boolean>(`${common.endpoint}/games/${game.uuid}?state=true`,this.uiGame2Game(game)).subscribe(
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

    private game2UiGame(game):IGameModel{
        const cards:ICardModel[][]=[];
        const g:IGameModel = Game.fromModel(game);
        game.cards.forEach((a,i)=>{
            cards.push([]);
            a.forEach(c=>{
                cards[i].push(new Card(c,i));
            });
        });
        g.cards= cards;
        return g;
    }

    private uiGame2Game(game:IGameModel):any{
        const g={};
        const cards:number[][]=[];

        game.cards.forEach((a,i)=>{
            cards.push([]);
            a.forEach(c=>{
                cards[i].push(c.cardNo);

            });
        });
        g['name'] = game.name;
        g['uuid'] = game.uuid;
        g['state'] = game.state;
        g['createDateTime'] = game.createDateTime;
        g['player1Uuid'] = game.player1Uuid;
        g['player2Uuid'] = game.player2Uuid;
        g['activePlayer'] = game.activePlayer;
        g['cards'] = cards;
        g['local'] = game.local;

        return g;
    }
}