import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable, of, merge, scheduled} from 'rxjs';
import { map, catchError, tap, mergeAll } from 'rxjs/operators';

import * as common from './service.common';
import {WsService} from './ws.service';
import {ProfileService} from './profile.service';
import {AuthService} from './auth.service';
import {IPlayerModel,Opponent} from 's-n-m-lib';
import {environment} from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _players:IPlayerModel[]= [{uuid:'111111',name:'Player1'},
                                    {uuid:'987654',name:'Suzannah'},
                                    {uuid:'111111',name:'Player1'},
                                    {uuid:'222222',name:'Player2'}];
  private _playersByGuid={
                          '111111':{uuid:'111111',name:'Player1'},
                          '222222':{uuid:'222222',name:'Player2'}
                         };
  private _activePlayer:IPlayerModel = null;
  private _opponents:Opponent[];
  private _opponents$:Observable<Opponent[]>;
//   private _opponentObserver:any;
  players$:Subject<IPlayerModel[]> = new Subject<IPlayerModel[]>();

  constructor(private http:HttpClient,
              private wsSvc:WsService,
              private profileSvc:ProfileService,
              private authSvc:AuthService) {
    // console.log(`PlayerService.constructor`);
  }
  getActivePlayer():IPlayerModel{
      return this._activePlayer;
  }
  getOpponents$():Observable<Opponent[]>{
    const result:Subject<Opponent[]> = new Subject<Opponent[]>();
    const url=`${common.endpoint}/players/opponents`;
    this.authSvc.getAccessJwtToken()
    .then(token=>{
        const headers= new HttpHeaders()
        .set('Authorization', token);
        this.http.get<Opponent[]>(url,{headers:headers}).subscribe(opponents=>{
            result.next(opponents);
        });
    });
    return result;
  }
  
  getPlayerByName$(name:string):Observable<IPlayerModel>{
      console.log(`player.service getPlayerByName$ name:${name}`);
      let player$:Observable<IPlayerModel>;
      if(!this._activePlayer){
          this._players.forEach(p=>{
              if(p.name===name){
                  this._activePlayer=p;
                  this.profileSvc.getProfile$().subscribe((profile)=>{
                      console.log(`Loaded profile for user: ${p.name}`);
                  });
              }
          });
      }
      if(!this._activePlayer || this._activePlayer.name != name){
          console.log(`player.service getPlayerByName$ can't find player in cache so call the database`);
          player$= this.http.get<any>(`${common.endpoint}/players?name=${name}`).pipe(
              tap((player) => console.log(`data.service.getPlayer(): ${player}`)),
              catchError(common.handleError<any>('getPlayerByName'))
          );
      }else{
          player$=of(this._activePlayer);
      }
    return player$;
  }
  setActivePlayer(playerGuid){
      console.log(`setActivePlayer(${playerGuid})`);
      this._activePlayer=this._playersByGuid[playerGuid];
  }
   private getPlayerById$(uuid):Observable<IPlayerModel>{ 
    let url = `${common.endpoint}/players?playerUuid=${uuid}`;
    
    console.log(`getPlayerById$(${uuid}): ${url} `);
    return this._getPlayer$(uuid,url);
  }
  getPlayer$():Observable<IPlayerModel>{  
    const result:Subject<IPlayerModel> = new Subject<IPlayerModel>();
    const url=`${common.endpoint}/players`;
    
//    console.error('B4 Auth Check:');
    this.authSvc.whoAmI()
    .then(sub=>{
        console.log('sub:', JSON.stringify(sub));
        const uuid=sub;
        this._getPlayer$(uuid,url).subscribe(p=>{
            result.next(p);
        },
        err => {
            console.error('getPlayer$()._getPlayer$:', JSON.stringify(err));
        });
    })
    .catch(err=>{
        console.error('getPlayer$().whoAmI:', JSON.stringify(err));
    }); 
    return result; 
  }
  _getPlayer$(uuid:string,url:string):Observable<IPlayerModel>{
    const result$:Subject<IPlayerModel> = new Subject<IPlayerModel>();
      
    if(!this._playersByGuid[uuid]){
        this.authSvc.getAccessJwtToken()
        .then(token=>{
            console.log(`uuid:${uuid} from DB\n${url}`);
            const headers= new HttpHeaders()
            .set('Authorization', token);
            this.http.get<IPlayerModel>(url,{headers:headers}).subscribe(p=>{
                this._playersByGuid[uuid]=p;
                result$.next(p);
            },
            err => {
                console.error('_getPlayer$.http.get:', JSON.stringify(err));
            });
        })
        .catch(err=>{
            console.error('_getPlayer$.getAccessJwtToken:', JSON.stringify(err));
        }); 
    }else{
        console.log(`_getPlayer$: ${uuid} from cache`);
        // this.players$.next(this._playersByGuid[uuid]);
        const player:IPlayerModel  = this._playersByGuid[uuid];
        result$.next(player);
    }
    
    return result$;
  }
  getPlayers(uuids:string[]=[]):IPlayerModel[]{
      let players:IPlayerModel[]=[];
      
      if(uuids.length !=2){
          throw new Error(`wrong number of players (${uuids.length})`);
      }
      uuids.forEach(async (uuid,i)=>{
        const p = this._playersByGuid[uuid];
        players.push(p);
      });
      return players;
  }
}
