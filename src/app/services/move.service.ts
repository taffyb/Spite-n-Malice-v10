import {Observable, of, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {IGameModel, Game} from '../classes/games';
import {IMoveModel,IPlayerModel,Player, Move} from 's-n-m-lib';
import {IMoveSubscriber} from '../classes/move.subscriber';
import {PositionsEnum, CardsEnum, MoveTypesEnum,IMoveMessage} from 's-n-m-lib';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as common from './service.common';
import {WsService} from './ws.service';
import {PlayerService} from './player.service';

@Injectable({
  providedIn: 'root',
})
export class MoveService{
    private _moves:IMoveModel[][] = []; //key by game UUID so can hold the moves for multiple games at same time.
 
    // private subscribers={};
    constructor(private http: HttpClient,
            private wsSvc: WsService,
            private playerSvc: PlayerService){
        console.log(`MoveService.constructor`);
 
    }
    $onMoves: Subject<{gameUuid: string, moves: IMoveModel[]}> = new Subject<{gameUuid: string, moves: IMoveModel[]}>();
    init(){
        if( this.wsSvc.connected){
            this.wsSvc.onRecieveMoves$().subscribe({
                next:(moves:IMoveMessage)=>{
                    console.log(`MoveService.wsSvc.onRecieveMoves$ ${JSON.stringify(moves)}`);
                    this.publishMoves(moves.gameUuid,moves.moves)
                },
                error:(err)=>{console.error(`onReceiveMoves error: ${JSON.stringify(err)}`)}
            }); 
        }
    }
    // subscribeToMoves(gameUuid: string, callback:(ms:{gameUuid: string,  moves: IMoveModel[]}) => any){
    //     if(!this.subscribers[gameUuid]){
    //         this.subscribers[gameUuid] = callback
    //     }
    // }
    publishMoves(gameUuid: string,ms: IMoveModel[]){
        const movesToPublish = {gameUuid: gameUuid, moves: ms}
        // console.log(`MoveService.publishMoves ${JSON.stringify(movesToPublish)}`);
        // for(let key in this.subscribers){
        //     if(key == gameUuid){
        //         this.subscribers[key]({gameUuid:gameUuid,moves:ms});
        //     }
        // }
        this.$onMoves.next(movesToPublish);
    }    
    addMove(game: IGameModel, playerUuid: string, m: IMoveModel){
        let moves: IMoveModel[] = [];
        moves.push(m);
        this.addMoves(game, playerUuid, moves);
    }
    addMoves(game: IGameModel, playerUuid: string, ms: IMoveModel[]){

        let moves: IMoveModel[];
        if(!this._moves[game.uuid]){
            moves = [];
            this._moves[game.uuid] = moves;
        }else{
            moves = this._moves[game.uuid];
        }
        ms.forEach(m=>{
            m.gameUuid=game.uuid;
            if(playerUuid){m.playerUuid=playerUuid;}
            m.id = this._moves[game.uuid].length+1;
            moves.push(m);
        });
        if(moves.length>0){
            this.publishMoves(game.uuid,ms);
            if(!game.local){
                const player1:IPlayerModel = new Player(); player1.uuid=game.player1Uuid;
                const player2:IPlayerModel = new Player(); player2.uuid=game.player2Uuid;
                const players:IPlayerModel[]=[player1,player2];
                const activePlayer:number=Number.parseInt(""+game.activePlayer);
                const opponent = (activePlayer===1?0:1);
                const moveMessage:IMoveMessage=
                    {moves:ms,from:players[activePlayer],to:players[opponent],gameUuid:game.uuid};
                this.wsSvc.publishMoves(moveMessage);
            }
            this.saveMoves(game.uuid,ms);
        }
    }
    saveMoves(gameUuid: string,ms: IMoveModel[]){
        ms.forEach((move)=>{   
            this.http.post<IMoveModel>(`${common.endpoint}games/${gameUuid}/moves`,move).subscribe(
                (val) => {
                    console.log(`POST call successful value returned in body ${JSON.stringify(val)}`);
                },
                response => {
                    if(response.status != 200){
                        console.error(`Error posting move:${JSON.stringify(move)}
                        ${JSON.stringify(response)}`);
                    }
                });
         });
    }
    moveToRecycle(game: Game, position: number){
        const moves:IMoveModel[]=[];
        for(let i = game.getCards(position).length-1; i>=0; i--){
            let c = game.getCards(position)[i];
            let m = new Move();
            m.card = c.cardNo;
            m.from = position;
            m.to = PositionsEnum.RECYCLE;
            m.type = MoveTypesEnum.RECYCLE;
            moves.push(m);
        }
        this.addMoves(game,"",moves);
    }
    getMoves$(gameUuid:string,playerUuid?:string,limit?:number):Observable<IMoveModel[]>{
        const url = `${common.endpoint}games/${gameUuid}/moves?${playerUuid?'playerUuid='+playerUuid:''}&${limit?'limit='+limit:''}`;
        return this.http.get<IMoveModel[]>(url).pipe(
            map((data)=>{
                const moves:IMoveModel[]=[];
                data.forEach((m)=>{
//                    console.log(`getMoves$ move:${JSON.stringify(m)}`);
                    const move: IMoveModel = Move.fromModel(m);
                    moves.push(move);
                });
                return moves;
            })
        );
    }
}
          