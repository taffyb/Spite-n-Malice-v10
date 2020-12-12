import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModules } from './material-module';
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { PileComponent } from './pile/pile.component';
import { PlayAreaComponent } from './play-area/play-area.component';
import { PlayerStackComponent } from './player-stack/player-stack.component';
import { GamePileComponent } from './game-pile/game-pile.component';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';

import { ModalDialog } from './modal-dialog/modal-dialog';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { HomeComponent } from './home/home.component';
import { SplashComponent } from './splash/splash.component';
import { TimezoneTestComponent } from './timezone-test/timezone-test.component';
import { InvitationComponent } from './invitation/invitation.component';
import { GameItemComponent } from './game-item/game-item.component';
import { MoveRptComponent } from './move-rpt/move-rpt.component';
import { GaugeComponent } from './gauge/gauge.component';
import { OpponentComponent } from './opponent/opponent.component';

import { AngularPageVisibilityModule } from 'angular-page-visibility';
import { GameExplorerComponent } from './game-explorer/game-explorer.component';
import { LoginComponent } from './login/login.component';


import {AmplifyAngularModule, AmplifyService} from 'aws-amplify-angular';
/* Add Amplify imports */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

/* Configure Amplify resources */
Amplify.configure(awsconfig);

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    PileComponent,
    PlayAreaComponent,
    PlayerStackComponent,
    GamePileComponent,
    BurgerMenuComponent,
    ProfileDialogComponent,
    ModalDialog,
    HelpDialogComponent,
    HomeComponent,
    SplashComponent,
    TimezoneTestComponent,
    MoveRptComponent,
    GaugeComponent,
    OpponentComponent,
    GameItemComponent,
    InvitationComponent,
    GameExplorerComponent,
    LoginComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModules,
    FormsModule,
    AngularPageVisibilityModule,    
    AmplifyUIAngularModule
  ],
  providers: [AmplifyService],
  bootstrap: [AppComponent],
  entryComponents:[HelpDialogComponent,ProfileDialogComponent, ModalDialog]
})
export class AppModule { }
