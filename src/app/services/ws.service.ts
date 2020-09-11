import { Injectable } from '@angular/core';
import { Observable,Observer } from 'rxjs';
import {IMoveModel,MoveTypesEnum, IPlayerModel,IGameModel,IInvitationMessage,IJoinMessage,IMoveMessage} from 's-n-m-lib';

import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WsService {
    SERVER_URL='ws://localhost:4001/'
    private socket;
    connected:boolean=false;

    constructor(){
        
    }

    connect(){
        this.socket = socketIo(this.SERVER_URL);
        this.connected=true;
    }
// OUT_GOING Messages
    public publishMoves(message:IMoveMessage){
        console.log(`wsSvc. publishMoves`);
        message.moves.forEach((m)=>{
            if(m.type==MoveTypesEnum.DEALER){
                m.type= MoveTypesEnum.REMOTE;
            }
        });
        this.socket.emit('send-moves', message);
    }
    public joinGame(player2:IPlayerModel,gameUuid:string){
        const join:IJoinMessage={player2:player2,gameUuid:gameUuid};
        this.socket.emit('join', join);
    }
    public send(message:string): void {
        this.socket.emit('message', message);
    }
    public sendInvite(player:IPlayerModel,opponent:IPlayerModel): void {
        const invite:IInvitationMessage={from:player,to:opponent,timestamp:Date.now()}
        this.socket.emit('invite', invite);
    }
    public login(player:IPlayerModel): void {
        this.socket.emit('login', {player:player});
    }
    public sendInviteResponse(response:string,invite:IInvitationMessage): void {
        invite.timestamp = Date.now();
        invite.response = (response==='accept'?true:false);
        this.socket.emit('invite-response', invite);
    }

 // IN_COMING Messages
    public onMessage$(): Observable<IMoveModel> {
        return new Observable<IMoveModel>(observer => {
            this.socket.on('message', (data: IMoveModel) => observer.next(data));
        });
    }
    public onPlayerActive$():Observable<IPlayerModel>{
        console.log(`initiate active player Observable `);
        return new Observable<IPlayerModel>(observer => {
            this.socket.on('player-online',(p:IPlayerModel) => { 
                console.log(`Player Online <${JSON.stringify(p)}>`);
                observer.next(p);
            });
        });
    }
    public onDisconnect$(): Observable<IPlayerModel> {
        return new Observable<IPlayerModel>(observer => {
            this.socket.on('disconnected',(opponent:IPlayerModel) => {observer.next(opponent);});
        });
    }
    public onInvitation$():Observable<IInvitationMessage>{
        return new Observable<IInvitationMessage>(observer => {
                this.socket.on('invitation',(invite) => {
                observer.next(invite);
            });
        });
    }
    public onInvitationResponse$():Observable<IInvitationMessage>{
        return new Observable<IInvitationMessage>(observer => {
                this.socket.on('invitation-response',(invite) => {
                observer.next(invite);
            });
        });
    }
    public onJoin$():Observable<string>{
        return new Observable<string>(observer => {
                this.socket.on('join',(join:IJoinMessage) => {
                observer.next(join.gameUuid);
            });
        });
    }
    public onRecieveMoves$():Observable<IMoveMessage>{
        
        return new Observable<IMoveMessage>(observer => {
                this.socket.on('receive-moves',(moveMessage:IMoveMessage) => {
//                    console.log(`wsSvc. receive-moves ${moveMessage.moves.length} ${JSON.stringify(moveMessage)}`);
                    console.log(`wsSvc. receive-moves`);
                    if(moveMessage.moves.length>0){
                        observer.next(moveMessage);
                    }
            });
        });
    }

    public onEvent$(event: Event): Observable<Event> {
        return new Observable<Event>(observer => {
            this.socket.on(event, (evt:Event) => observer.next(evt));
        });
    }
}
