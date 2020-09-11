import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayAreaComponent }   from './play-area/play-area.component';
import { HomeComponent }   from './home/home.component';
import { MoveRptComponent }   from './move-rpt/move-rpt.component';

const routes: Routes = [
                        { path: '', redirectTo: '/', pathMatch: 'full' },
                        { path: 'play-area/:gameUuid', component: PlayAreaComponent},
                        { path: 'home', component: HomeComponent},
                        { path: 'move-rpt/:gameUuid', component: MoveRptComponent}
                   ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
