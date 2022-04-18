import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import {PlayerService} from '../services/player.service';
import {ProfileService} from '../services/profile.service';
import {GameService} from '../services/game.service';
import {WsService} from '../services/ws.service';
import {IGameModel} from '../classes/games';
import {IPlayerModel, IInvitationMessage} from 's-n-m-lib';
import { Auth } from 'aws-amplify';
import { AuthService } from '../services/auth.service';
import { AuthTypesEnum } from '../classes/auth.enums';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  player:IPlayerModel;
  games$;
  opponents$;
  invitations:IInvitationMessage[]=[];
  
  constructor(
          private router: Router,
          private route: ActivatedRoute,
          private gameSvc:GameService,
          private playerSvc:PlayerService,
          private authSvc:AuthService,
          private profileSvc:ProfileService,
          private wsSvc:WsService) {
      console.log(`HomeComponent: Constructor`);

  }

  ngOnInit() {      
    console.log(`HomeComponent: Init`);
    
    Auth.currentAuthenticatedUser()
    .then(user =>{ 
      console.log(`HomeComponent.currentAuthenticatedUser: ${user.username}`);
      
      this.playerSvc.getPlayer$().subscribe(player=>{
        
        this.authSvc.getAccessJwtToken()
        .then(token=>{
          console.log(`token:\n${token}`);
          
        });
        this.playerSvc.setActivePlayer(player.uuid);
        console.log(`HomeComponent.getPlayer$: ${JSON.stringify(player,null,2)}`);
        this.profileSvc.getProfile$().subscribe({
          next:(profile)=>{console.log(`Load Profile for ${player.uuid}: ${JSON.stringify(profile)}`)},
          error:(err)=>{console.log(`getProfile error: ${JSON.stringify(err)}`)}
        });
        this.games$= this.gameSvc.getGames$(3);
        // this.opponents$=this.playerSvc.getOpponents$(this.player.uuid);
        if(this.authSvc.getAuthStatus()==AuthTypesEnum.AUTHENTICATED){
          // this.wsSvc.connect();
        }
      });
    });         
  }
  
  newGame(){

    
    const g= this.gameSvc.newGame("game", this.playerSvc.getActivePlayer().uuid, "Player2",true);
    
    
        const url:string = `/play-area/${g.uuid}`;
        this.router.navigate([url]);
  }
  sendInvite(opponent:IPlayerModel){
      console.log(`Asking ${opponent.name} to play a game`);
      let invite:IInvitationMessage = {from:this.player,to:opponent,timestamp:Date.now()};
      this.wsSvc.send("invititation",invite);
  }
  sendInviteResponse(invite:IInvitationMessage){
      this.wsSvc.send<IInvitationMessage>("invitationResponse",invite);
      
      this.invitations.forEach((i:IInvitationMessage,j)=>{
          if(i.uuid===invite.uuid){
              this.invitations.splice(j,1);
          }
      });
  }
}
