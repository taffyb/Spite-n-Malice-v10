import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService} from './auth.service';
import {AuthTypesEnum} from '../classes/auth.enums';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {  
  constructor( public router: Router,
               private authSvc:AuthService ) {} 
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {

    console.log(`next: ${next.url}`)
    return this.isVisible(next.url[0].toString());
  }
  isVisible(target:string):boolean{
      const authStatus:AuthTypesEnum = this.authSvc.getAuthStatus();
      let visible=false;
      target=target.split('/')[0];
      switch(target){
        case 'login':
          visible=true;
          break;
          case 'burger':
            visible=(authStatus!=AuthTypesEnum.UNAUTHENTICATED);
            break;
          case 'welcome':
              visible=(authStatus!=AuthTypesEnum.AUTHENTICATED);
              break;
          case 'home':
              visible=(authStatus==AuthTypesEnum.AUTHENTICATED);
              break;
          case 'play-area':
            visible=(authStatus!=AuthTypesEnum.UNAUTHENTICATED);
              break;
      }
      // console.log(`${MyAuthTypesEnum[authStatus]} auth-guard.isVisible target:${target} visible:${visible}`);
      return visible;
  }
}