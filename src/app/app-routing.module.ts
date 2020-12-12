import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashComponent }   from './splash/splash.component';
import { LoginComponent }   from './login/login.component';
import { PlayAreaComponent }   from './play-area/play-area.component';
import { HomeComponent }   from './home/home.component';
import { MoveRptComponent }   from './move-rpt/move-rpt.component';

const routes: Routes = [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent},
      { path: 'welcome', component: SplashComponent},
      { path: 'play-area/:gameUuid', component: PlayAreaComponent},
      { path: 'home', component: HomeComponent},
      { path: 'move-rpt/:gameUuid', component: MoveRptComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
