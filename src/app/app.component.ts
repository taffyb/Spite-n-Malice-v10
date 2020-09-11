import {Component,OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {ProfileService} from './services/profile.service';
import {PlayerService} from './services/player.service';
import {GameService} from './services/game.service';
import {Game, IGameModel} from './classes/games';
import {IProfileModel, IPlayerModel} from 's-n-m-lib';
import {MatDialog } from '@angular/material';
import {ModalDialog, DialogOptions } from './modal-dialog/modal-dialog';

import {ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    profile$:Observable<IProfileModel>;
    player:IPlayerModel;
    title:string="Spite-Malice-v9";
//    game:Game;

    constructor(
            private router: Router,
            private playerSvc:PlayerService,
            private profileSvc:ProfileService,
            private gameSvc:GameService,
            public dialog: MatDialog){
        console.log(`AppComponent: Constructor`);
    }
    
    ngOnInit(){
//        console.log(`AppComponent: ngOnInit`);
    }

   async loadProfile(player){
       console.log(`AppComponent.loadProfile player:${JSON.stringify(player)}`);
        if(player)  {          
            this.profile$=this.profileSvc.getProfile$(player.uuid); 
            this.router.navigate(['/home']);
        }
    }
    async guestEntry(){
        this.player = await this.playerSvc.getPlayerByName$("Player1").toPromise();
        this.profile$=this.profileSvc.getDefaultProfile$();
        const game:IGameModel = this.gameSvc.newGame("new",this.player.uuid,"222222",true); 
        this.router.navigate([`/play-area/${game.uuid}`]);
    }
}
