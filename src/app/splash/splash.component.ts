import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {Observable, of} from 'rxjs';
import { ModalDialog, DialogOptions } from '../modal-dialog/modal-dialog';
import {IPlayerModel, IGameModel, IProfileModel} from 's-n-m-lib';
import {PlayerService} from '../services/player.service';
import {ProfileService} from '../services/profile.service';
import {GameService} from '../services/game.service';
import {AuthService} from '../services/auth.service';
import {AuthTypesEnum} from '../classes/auth.enums';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  @Output()onLogin:EventEmitter<IPlayerModel> = new EventEmitter<IPlayerModel>();
  
  constructor(
    private router: Router,
    private playerSvc:PlayerService,
    private myAuthSvc:AuthService,
    private profileSvc:ProfileService,
    private gameSvc:GameService,
    public dialog: MatDialog) 
  { }

  ngOnInit() {
  }
  

  login(){

    Auth.currentAuthenticatedUser()
    .then(user =>{ 
        this.myAuthSvc.setAuthStatus(AuthTypesEnum.AUTHENTICATED);
        this.playerSvc.setActivePlayer(user.username);
        this.router.navigate([`/home`]);
    })
    .catch(err => {
      console.log(err);
      this.myAuthSvc.setAuthStatus(AuthTypesEnum.UNAUTHENTICATED);
      this.router.navigate([`/login`]);
    });
              
  }
  async guestEntry(){
    console.log('GUEST ENTRY');
    this.myAuthSvc.setAuthStatus(AuthTypesEnum.GUEST);
    const player = await this.playerSvc.getPlayerByName$("Player1").toPromise();
    // const profile$:Observable<IProfileModel> = this.profileSvc.getDefaultProfile$();
    const game= this.gameSvc.newGame("game",player.uuid,"222222",true);
    
    // g$.subscribe({
    //     next:g=>{
    //       console.log('splash.component.g$.next:');
    //       const url:string = `/play-area/${g.uuid}`;
    //       this.router.navigate([url]);
    //     },
    //     error:err=>{
    //       console.error('error creating new game:', JSON.stringify(err));
    //     }
    // });
    this.router.navigate([`/play-area/${game.uuid}`]);
  }

}
