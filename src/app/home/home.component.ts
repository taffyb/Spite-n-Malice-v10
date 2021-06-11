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
        // console.log(`currentAuthenticatedUser:${user.username} User${JSON.stringify(user)}`);
        // const key:string=`CognitoIdentityServiceProvider.${user.pool.clientId}.${user.username}.idToken`;
        // console.log(`idToken:\n${user.storage[key]}`);        
        
        this.playerSvc.setActivePlayer(user.username);
        this.player = this.playerSvc.getActivePlayer();
        this.profileSvc.getProfile$(this.player.uuid).subscribe({
          next:(profile)=>{console.log(`Load Profile for ${this.player.uuid}: ${JSON.stringify(profile)}`)},
          error:(err)=>{console.log(`getProfile error: ${JSON.stringify(err)}`)}
        });
        // console.log(`Player: ${JSON.stringify(this.player)}`);
        this.games$= this.gameSvc.getGames$(this.player.uuid,3);
        this.opponents$=this.playerSvc.getOpponents$(this.player.uuid);
        // this.wsSvc.connect();
        
        // this.authSvc.getAccessJwtToken()
        // .then(token=>{
        //   console.log(token);
          
        // });
      })
      .catch(err => console.log(err)
      );
  }
  
  newGame(){

    const g:IGameModel = this.gameSvc.newGame("game", this.playerSvc.getActivePlayer().uuid, "Player2",true);
    // this.game = g;
    const url:string = `/play-area/${g.uuid}`;
    // console.log(`route to new game: ${url}`);
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
