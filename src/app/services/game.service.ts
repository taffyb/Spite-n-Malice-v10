
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {IGameModel, GameFactory, Game} from '../classes/games';
import {Card, ICardModel, GameStatesEnum} from 's-n-m-lib';
import {DealerService} from './dealer.service';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {Observable, of, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthTypesEnum } from "../classes/auth.enums";
import { PlayerService } from "./player.service";

@Injectable({
  providedIn: 'root',
})
export class GameService{
    public game$:Subject<Game> = new Subject<Game>();
    private _games={};
    statusChanged: Subject<{status:GameStatesEnum, game: IGameModel}> = new Subject<{status:GameStatesEnum, game: IGameModel}>();
    constructor(private http:HttpClient, 
                private dealerSvc:DealerService, 
                private playerSvc:PlayerService, 
                private authSvc:AuthService){
    }

    getGameCards$(gameUuid:string):Observable<number[][]>{
        const result:Subject<number[][]> = new Subject<number[][]>();
        
        if(this.authSvc.getAuthStatus()==AuthTypesEnum.AUTHENTICATED){
            const url = `${environment.apiGateway}/games/${gameUuid}?cards=true`;
            this.authSvc.getAccessJwtToken()
            .then(token=>{
                // console.log(`token:\n${token}`);
                const headers= new HttpHeaders().set('Authorization', token);
                const http$ = this.http.get<number[][]>(url,{headers:headers});
                http$.subscribe(cards=>{
                    result.next(cards);
                    result.complete();
                })
            });
        }
        return result;
    }
    getGame(gameUuid:string):void{
        console.log(`getGame$: ${gameUuid}`);
        if(this.authSvc.getAuthStatus()==AuthTypesEnum.AUTHENTICATED){
            if(!this._games[gameUuid]){   
                const url = `${environment.apiGateway}/games/${gameUuid}`;
                this.authSvc.getAccessJwtToken()
                .then(token=>{
                    console.log(`token:\n${token}`);
                    const headers= new HttpHeaders().set('Authorization', token);
                    const http$ = this.http.get<any>(url,{headers:headers});
                    http$.subscribe(g=>{
                        const game:Game = Game.fromModel(g);
                        
                        this.getGameCards$(gameUuid).subscribe(cards=>{
                            console.log(`AUTHENTICATED getGameCards$ from DB`);
                            this._games[gameUuid]=game;
                            game.cards = this.numericCards2UiCards(cards);
                            this.game$.next(game);
                            this.game$.complete();
                        },
                        (err)=>{
                            console.error(`Error retrieving Cards for: ${gameUuid}\n${JSON.stringify(err)}`);
                            
                        });
                    },
                    (err)=>{console.error(`http$.subscribe:${JSON.stringify(err)}`);
                    })
                })
                .catch((err)=>{
                    console.error(`http$.getAccessJwtToken:${JSON.stringify(err)}`);
                });
            }else{
                console.log(`AUTHENTICATED getGame$ get from cache`);
                const game:Game=this._games[gameUuid];
                console.log(`game.cards ${game.cards?game.cards.length:'MISSING'}`);
                if(!game.cards){
                    this.getGameCards$(gameUuid).subscribe( async cards=>{
                        game.cards = this.numericCards2UiCards(cards);
                        this.game$.next(game);
                        this.game$.complete();
                    },
                    (err)=>{
                        console.error(`Error retrieving Cards for: ${gameUuid}\n${JSON.stringify(err)}`);
                        
                    });
                }else{
                    this.game$.next(game);
                    this.game$.complete();
                }
            }      
        }else{
            console.log(`UNAUTHENTICATED getGame$ get from cache [${gameUuid}]`);
            const game:Game=this._games[gameUuid];
            this.game$.next(game);
        }
    }
    getGames$(limit?:number):Observable<IGameModel[]>{
        const result:Subject<IGameModel[]> = new Subject<IGameModel[]>();
        const url = `${environment.apiGateway}/players/games`;
        console.log(`getGames$: ${url}`);
        this.authSvc.getAccessJwtToken()
        .then(token=>{
            // console.log(`token:\n${token}`);
            const headers= new HttpHeaders().set('Authorization', token);
            const http$ = this.http.get<IGameModel[]>(url,{headers:headers});
            http$.subscribe(res=>{
                result.next(res);
            });
        });
        return result;
    }
    newGame(name:string,player1Uuid:string,player2Uuid:string,local:boolean):Game{
        // const result$:Subject<Game> = new Subject<Game>();
        const deck:number[] = this.dealerSvc.getDeck();
        const g:IGameModel=GameFactory.newGame(name,player1Uuid, player2Uuid,deck,local);
        const game:Game=Game.fromModel(g);
        this._games[game.uuid]=game;
        this.statusChanged.next({status:GameStatesEnum.NEW,game:game});
        return game;
    }
    saveGame(game:IGameModel){
        console.log(`saveGame [${game.uuid}]`);
        let g:any =JSON.parse(JSON.stringify(game));
        g.cards =this.uiCards2NumericCards(game.cards);
        this.http.post<IGameModel>(`${environment.apiGateway}/games`,g).subscribe();
    }
    updateGame(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        let g:any =JSON.parse(JSON.stringify(game));
        g.cards =this.uiCards2NumericCards(game.cards);
        this.http.put<boolean>(`${environment.apiGateway}/games/${game.uuid}?activePlayer=true`,g).subscribe(
                (val) => {
                    console.log(`updateGame Success`);
                },
                response => {
                    console.error("Error Updating Game", response);
                });
    }
    updateGameName(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        let g:any =JSON.parse(JSON.stringify(game));
        g.cards =this.uiCards2NumericCards(game.cards);
        this.http.put<boolean>(`${environment.apiGateway}/games/${game.uuid}?name=true`,g).subscribe(
                (val) => {
                    console.log(`updateName Success`);
                },
                response => {
                    console.error("Error Updating Game Name", response);
                });
    }
    updateGameState(game:IGameModel){
        
        game.updateDateTime=""+Date.now();
        let g:any =JSON.parse(JSON.stringify(game));
        g.cards =this.uiCards2NumericCards(game.cards);
        this.http.put<boolean>(`${environment.apiGateway}/games/${game.uuid}?state=true`,g).subscribe(
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
    private numericCards2UiCards(cards:number[][]):ICardModel[][]{
        const uiCards:ICardModel[][]=[];
        cards.forEach((a,i)=>{
            uiCards.push([]);
            a.forEach(c=>{
                uiCards[i].push(new Card(c,i));
            });
        });
        return uiCards;
    }
    private uiCards2NumericCards(uiCards:ICardModel[][]):number[][]{
        // const g={};
        let cards:number[][]=[];
        // console.log(`uiCards2NumericCards: ${JSON.stringify(uiCards)}`);
        
        uiCards.forEach((a,i)=>{
            cards.push([]);
            a.forEach(c=>{
                if(typeof c != 'number' ){
                    cards[i].push(c.cardNo);
                }else{
                    cards[i].push(c);
                }
            });
        });

        return cards;
    }
}