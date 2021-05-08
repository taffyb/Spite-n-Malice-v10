import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import {PlayerService} from '../services/player.service';
import {ProfileService} from '../services/profile.service';
import {GameService} from '../services/game.service';
import {WsService} from '../services/ws.service';
import {IGameModel} from '../classes/games';
import {IPlayerModel, IInvitationMessage} from 's-n-m-lib';
import { Auth } from 'aws-amplify';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  player:IPlayerModel;
//   game:IGameModel;
  games$;
  opponents$;
  invitations:IInvitationMessage[]=[];
  
  constructor(
          private router: Router,
          private route: ActivatedRoute,
          private gameSvc:GameService,
          private playerSvc:PlayerService,
          private profileSvc:ProfileService,
          private wsSvc:WsService) {
      console.log(`HomeComponent: Constructor`);

  }

  ngOnInit() {      
    console.log(`HomeComponent: Init`);
    
    Auth.currentAuthenticatedUser()
    .then(user =>{ 
        // console.log(`currentAuthenticatedUser:${user.username} User${JSON.stringify(user)}`);
        const key:string=`CognitoIdentityServiceProvider.${user.pool.clientId}.${user.username}.idToken`;
        console.log(`idToken:\n${user.storage[key]}`);
        
        this.playerSvc.setActivePlayer(user.username);
        this.player = this.playerSvc.getActivePlayer();
        this.profileSvc.getProfile$(this.player.uuid).subscribe({
          next:(profile)=>{console.log(`Load Profile for ${this.player.uuid}: ${JSON.stringify(profile)}`)},
          error:(err)=>{console.log(`getProfile error: ${JSON.stringify(err)}`)}
        });
        // console.log(`Player: ${JSON.stringify(this.player)}`);
        this.games$= this.gameSvc.getGames$(this.player.uuid,3);
        this.opponents$=this.playerSvc.getOpponents$(this.player.uuid);
        // wsSvc.connect();
        // wsSvc.login(this.player);
             
        // this.wsSvc.onInvitation$().subscribe({
        //     next:(invite)=>{this.invitations.push(invite);},
        //     error:(err)=>{console.log(`onPlayerActive error: ${JSON.stringify(err)}`);}
        // });
        // this.wsSvc.onInvitationResponse$().subscribe({
        //     next:(invite)=>{
        //         if(invite.response){
        //             const game:IGameModel = this.gameSvc.newGame("new",this.player.uuid,invite.to.uuid,false); 
        //             this.wsSvc.joinGame(invite.to, game.uuid);
        //             this.router.navigate([`/play-area/${game.uuid}`]);
        //         }
        //     },
        //     error:(err)=>{console.log(`onPlayerActive error: ${JSON.stringify(err)}`);}
        // });
        // this.wsSvc.onJoin$().subscribe({
        //     next:(gameUuid)=>{
        //         this.router.navigate([`/play-area/${gameUuid}`]);
        //     },
        //     error:(err)=>{console.log(`onPlayerActive error: ${JSON.stringify(err)}`);}
        // });
      })
      .catch(err => console.log(err)
      );
  }
  
  newGame(){

    const g:IGameModel = this.gameSvc.newGame("game", this.playerSvc.getActivePlayer().uuid, "Player2",true);
    // this.game = g;
    const url:string = `/play-area/${g.uuid}`;
    console.log(`route to new game: ${url}`);
    this.router.navigate([url]);
  }
  sendInvite(opponent:IPlayerModel){
      console.log(`Asking ${opponent.name} to play a game`);
      this.wsSvc.sendInvite(this.player,opponent);
  }
  sendInviteResponse(response:string,invite:IInvitationMessage){
      this.wsSvc.sendInviteResponse(response, invite);
      
      this.invitations.forEach((i:IInvitationMessage,j)=>{
          if(i.uuid===invite.uuid){
              this.invitations.splice(j,1);
          }
      });
  }
}
