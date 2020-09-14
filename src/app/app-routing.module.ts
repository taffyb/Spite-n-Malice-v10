import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashComponent }   from './splash/splash.component';
import { PlayAreaComponent }   from './play-area/play-area.component';
import { HomeComponent }   from './home/home.component';
import { MoveRptComponent }   from './move-rpt/move-rpt.component';

const routes: Routes = [
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
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
