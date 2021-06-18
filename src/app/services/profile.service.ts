import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable,Subject, of} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as common from './service.common';
import {IProfileModel,DEFAULT_PROFILE,IPlayerModel} from 's-n-m-lib';
import {Location, TimeZone} from '../classes/timezones'
import {environment} from '../../environments/environment';
import { AuthService } from './auth.service';
import { CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js'
import { AuthTypesEnum } from '../classes/auth.enums';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile:IProfileModel = DEFAULT_PROFILE;
  private playerGuid:string;


  constructor(private http:HttpClient,
              private authSvc:AuthService) { }
  
  getActiveProfile():IProfileModel{
    console.log(`getActiveProfile:${JSON.stringify(this._profile,null,2)}`);
      return this._profile;
  }
  getProfile$():Observable<IProfileModel>{  
    console.log(`getProfile$`);  
    const result:Subject<IProfileModel> = new Subject<IProfileModel>();
    if(this.authSvc.getAuthStatus()==AuthTypesEnum.AUTHENTICATED){
      const url = `${environment.apiGateway}/players/profile`;
      this.authSvc.getAccessJwtToken()
      .then(token=>{
        const headers= new HttpHeaders()
            .set('Authorization', token);
          this.http.get<any>(url,{'headers':headers}).pipe(tap(profile=>{this._profile=profile;})).subscribe(
            (profile)=>{
              console.log(`RESPONSE: ${JSON.stringify(profile)}`);            
              result.next(profile);
            }
          );
        });
      return result;
    }else{
      return of(this._profile);
    }
  }
  saveProfile(profile:IProfileModel){ 
    console.log(`saveProfile`);  
    this._profile = profile;
    this.authSvc.getAccessJwtToken()
    .then(token=>{
      const headers= new HttpHeaders()
          .set('Authorization', token);       
        const url = `${environment.apiGateway}/players/profile`;
        this.http.put<any>(url,profile,{'headers':headers}).subscribe((res)=>{
          // console.log(`RESPONSE: ${JSON.stringify(res)}`);
          null; //if we don't subscribe the http call is not made
        });
    });
  }
  getDefaultProfile$():Observable<IProfileModel>{
      this._profile=DEFAULT_PROFILE;
      // this._profile.showStatistics=false;
      return of(this._profile);
  }
  
  // getLocations$():Observable<Location[]>{
  //     const url = `http://worldtimeapi.org/api/timezone`;
  //     console.log(`getLocations$: ${url}`);
  //     return this.http.get<string[]>(url).pipe(
  //        map((locations)=>{
  //            console.log(`Locations: ${JSON.stringify(locations)}`);
  //             const locs:Location[]=[];
  //             locations.forEach(l=>{
  //                 locs.push(new Location(l));
  //             });          
  //             return locs;
  //         })
  //     );
  // }
  // getTimeZone$(loc:Location):Observable<TimeZone>{
  //     const url = `http://worldtimeapi.org/api/timezone/${loc.area()}/${loc.location()}/${loc.region()}`;
  //     console.log(`getTimeZones$: ${url}`);
  //     return this.http.get<TimeZone>(url).pipe(
  //         tap((tz)=>{
  //            console.log(`getTimeZone$:${JSON.stringify(tz)}`);     
  //         })
  //     );
  // }
}
