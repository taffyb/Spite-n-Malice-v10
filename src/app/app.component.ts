import {Component,OnInit,ChangeDetectorRef } from '@angular/core';
import {Observable} from 'rxjs';
// import {AuthService} from './services/auth.service';
// import {AuthTypesEnum} from './classes/auth.enums';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';
import { AuthService } from './services/auth.service';
import {ProfileService} from './services/profile.service';
import {GameService} from './services/game.service';
import {PlayerService} from './services/player.service';
import {IProfileModel, GameStatesEnum} from 's-n-m-lib';
import { MatDialog } from '@angular/material/dialog';
import {User} from './classes/user.model';

import {Router, NavigationStart } from '@angular/router';
import { MyAuthTypesEnum } from './classes/auth.enums';
import { AuthGuardService } from './services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title:string="Spite-Malice-v10";
    links: any[] =[];
    profile$:Observable<IProfileModel>;
    user: CognitoUserInterface | undefined;
    authState: AuthState;
    selectedTab:number=0;
    selectedTabName:string="welcome";
    authStates=MyAuthTypesEnum;

    constructor(
            private router: Router,
            private profileSvc:ProfileService,
            private gameSvc:GameService,
            private playerSvc:PlayerService,
            private authSvc:AuthService,
            private authGuardSvc:AuthGuardService,
            private ref: ChangeDetectorRef,
            public dialog: MatDialog
            ){

        router.events.subscribe((event)=>{
            if(event instanceof NavigationStart){
                let eventUrl = event.url;
                eventUrl=eventUrl.substr(1,eventUrl.length-1);
                
                this.links.forEach((l,i)=>{
                    if(l.target==eventUrl){
                        this.selectedTab=i;
                        this.selectedTabName=l.target;
                    }
                });
            }
            
        });
        // console.log(`AppComponent: Constructor`);
    }
    onSelectTab(tabName){
        this.selectedTabName=tabName;
    }
    ngOnInit(){
       this.links.push({label: 'Welcome',target:'welcome'});
       this.links.push({label: 'Home',target:'home'});

       this.gameSvc.statusChanged.subscribe((change) => {
            const label: string = change.game.name;
            switch(change.status){
                case GameStatesEnum.NEW:
                    this.links.push({label: label,target:`play-area/${change.game.uuid}`,visible:true,allowClose:true});
            }
        });
       onAuthUIStateChange((authState, authData) => {
        this.authState = authState;
        this.user = authData as CognitoUserInterface;
        this.ref.detectChanges();
        if(this.authState==AuthState.SignedIn){
            
            // this.playerSvc.setActivePlayer(this.user.username);
            this.authSvc.setAuthStatus(MyAuthTypesEnum.AUTHENTICATED);
            this.router.navigate(['/home']);

        }
      })
    }

    close(linkTarget:string){
        let previousLink:string;
        this.links.forEach((l,i)=>{
            if(this.isVisible(l.target)){
                if(l.target==linkTarget){
                    this.router.navigate(['/'+previousLink]);
                    this.links.splice(i,1);
                }else{
                    previousLink= l.target;
                }
            }
        });
        return false; // return false so click does not bubble to tab.
    }
   async loadProfile(player){
       console.log(`AppComponent.loadProfile player:${JSON.stringify(player)}`);
        if(player)  {          
            this.profile$=this.profileSvc.getProfile$(); 
            this.router.navigate(['/home']);
        }
    }
    isVisible(targetUrl:string):boolean{
        let isVisible:boolean = this.authGuardSvc.isVisible(targetUrl);
        return isVisible;
    }

}
