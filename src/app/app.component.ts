import {Component,OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthService} from './services/auth.service';
import {AuthTypesEnum} from './enums';
import {ProfileService} from './services/profile.service';
import {PlayerService} from './services/player.service';
import {GameService} from './services/game.service';
import {Game, IGameModel} from './classes/games';
import {IProfileModel, IPlayerModel, GameStatesEnum} from 's-n-m-lib';
import { MatDialog } from '@angular/material/dialog';
import {ModalDialog, DialogOptions } from './modal-dialog/modal-dialog';

import {ActivatedRoute, Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title:string="Spite-Malice-v10";
    links: any[] =[];
    profile$:Observable<IProfileModel>;
    authTypes = AuthTypesEnum;
    authStatus: AuthTypesEnum = AuthTypesEnum.UNAUTHENTICATED;
    selectedTab:number=0;

    constructor(
            private router: Router,
            private playerSvc:PlayerService,
            private profileSvc:ProfileService,
            private gameSvc:GameService,
            public dialog: MatDialog,
            private authSvc: AuthService){
        authSvc.authStatusChanged.subscribe((status) => {
            this.authStatus = status;
            console.log(`Auth Status: ${AuthTypesEnum[this.authStatus]}`);
        });
        gameSvc.statusChanged.subscribe((change) => {
            const label: string = change.game.name;
            switch(change.status){
                case GameStatesEnum.NEW:
                    this.links.push({label: label,target:`play-area/${change.game.uuid}`,visible:true,allowClose:true});
            }
        });
        router.events.subscribe((event)=>{
            if(event instanceof NavigationStart){
                let eventUrl = event.url;
                eventUrl=eventUrl.substr(1,eventUrl.length-1);
                this.links.forEach((l,i)=>{
                    if(l.target==eventUrl){
                        this.selectedTab=i;
                    }
                });
            }
            
        });
        console.log(`AppComponent: Constructor`);
    }
    close(linkTarget:string){
        let previousLink:string;
        this.links.forEach((l,i)=>{
            if(l.target==linkTarget){
                this.router.navigate([previousLink]);
                console.log(`Navigate to : ${previousLink}`);
                this.links.splice(i,1);
            }else{
                previousLink= l.target;
            }
        });
    }
    ngOnInit(){
       this.links.push({label: 'Welcome',target:'welcome'});
       this.links.push({label: 'Home',target:'home'});
    }

   async loadProfile(player){
       console.log(`AppComponent.loadProfile player:${JSON.stringify(player)}`);
        if(player)  {          
            this.profile$=this.profileSvc.getProfile$(player.uuid); 
            this.router.navigate(['/home']);
        }
    }
    isVisible(targetUrl:string):boolean{
        let visible=false;
        const target:string = targetUrl.split('/')[0];
        switch(target){
            case 'welcome':
                visible=true;
                break;
            case 'home':
                visible=this.authStatus===AuthTypesEnum.AUTHENTICATED;
                break;
            case 'play-area':
                visible=this.authStatus!=AuthTypesEnum.UNAUTHENTICATED;
                break;
            case 'settings':
                visible=this.authStatus===AuthTypesEnum.AUTHENTICATED;
                break;
        }
        return visible;
    }
}
