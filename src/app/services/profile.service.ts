import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable,Subject, of} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {IProfileModel,DEFAULT_PROFILE,IPlayerModel} from 's-n-m-lib';
import {Location, TimeZone} from '../classes/timezones'
import {environment as env} from '../../environments/environment';
import { AuthService } from './auth.service';
import { CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js'
import { AuthTypesEnum } from '../classes/auth.enums';
import { AST } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile:IProfileModel = DEFAULT_PROFILE;
  private playerGuid:string;
  public profile$:Subject<IProfileModel> = new Subject<IProfileModel>();


  constructor(private http:HttpClient,
              private authSvc:AuthService) { }
  
  getActiveProfile():IProfileModel{
    console.log(`getActiveProfile: isProduction ${env.production} isDebugging ${env.debugging}`);
  //   if(!env.production==true && env.debugging==true ){
  //    this._profile['showExplorer']=true;
  // }
      return this._profile;
  }
  getProfile$():Observable<IProfileModel>{  
    console.log(`getProfile$`);  
    const result:Subject<IProfileModel> = new Subject<IProfileModel>();
    if(this.authSvc.getAuthStatus()==AuthTypesEnum.AUTHENTICATED){
      const url = `${env.apiGateway}/players/profile`;
      this.authSvc.getAccessJwtToken()
      .then(token=>{
        const headers= new HttpHeaders()
            .set('Authorization', token);
          this.http.get<IProfileModel>(url,{'headers':headers}).subscribe(
            (profile)=>{
              this._profile=profile;
              console.log(`RESPONSE: ${JSON.stringify(profile)}`);            
              result.next(profile);
            }),
            (err)=>{
              console.error(`ERROR: ${JSON.stringify(err)}`);  
            };
        });
      return result;
    }else{
      return of(this._profile);
    }
  }
  saveProfile(profile:IProfileModel){ 
    console.log(`saveProfile`);  
    this._profile = profile;
    const status:AuthTypesEnum = this.authSvc.getAuthStatus();
    if(status==AuthTypesEnum.AUTHENTICATED){
      this.authSvc.getAccessJwtToken()
      .then(token=>{
        const headers= new HttpHeaders()
            .set('Authorization', token);       
          const url = `${env.apiGateway}/players/profile`;
          this.http.put<any>(url,profile,{'headers':headers}).subscribe((res)=>{
            // console.log(`RESPONSE: ${JSON.stringify(res)}`);
            null; //if we don't subscribe the http call is not made
          });
      });
    }
    this.profile$.next(profile);
  }
  getDefaultProfile$():Observable<IProfileModel>{
      this._profile=DEFAULT_PROFILE;
      this._profile['sideBySide']=false;
      if(!env.production==true && env.debugging==true){

       this._profile['showExplorer']=true;
    }
      return of(this._profile);
  }
  
}
