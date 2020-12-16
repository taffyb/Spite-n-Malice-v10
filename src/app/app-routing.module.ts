import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthGuardService} from './services/auth-guard.service';

import { SplashComponent }   from './splash/splash.component';
import { LoginComponent }   from './login/login.component';
import { PlayAreaComponent }   from './play-area/play-area.component';
import { HomeComponent }   from './home/home.component';
import { MoveRptComponent }   from './move-rpt/move-rpt.component';
import { fromEventPattern } from 'rxjs';

const routes: Routes = [
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      { path: 'login', component: LoginComponent,canActivate:[AuthGuardService]},
      { path: 'welcome', component: SplashComponent,canActivate:[AuthGuardService]},
      { path: 'play-area/:gameUuid', component: PlayAreaComponent,canActivate:[AuthGuardService]},
      { path: 'home', component: HomeComponent,canActivate:[AuthGuardService]},
      { path: 'move-rpt/:gameUuid', component: MoveRptComponent,canActivate:[AuthGuardService]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
