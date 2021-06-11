import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable,Subject, of} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as common from './service.common';
import {IProfileModel,DEFAULT_PROFILE,IPlayerModel} from 's-n-m-lib';
import {Location, TimeZone} from '../classes/timezones'
import {environment} from '../../environments/environment';
import { Auth } from 'aws-amplify';
import { CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile:IProfileModel = DEFAULT_PROFILE;
  private playerGuid:string;

  getSession = (): Promise<CognitoUserSession | null> => Auth.currentSession();

  constructor(private http:HttpClient) { }
  
  getActiveProfile():IProfileModel{
    console.log(`getActiveProfile:`);
      return this._profile;
  }
  getProfile$(playerGuid:string):Observable<IProfileModel>{
    const profile$:Subject<IProfileModel> = new Subject<IProfileModel>();
    this.getSession().then((session) => {
      if(session && session.isValid()) { 
        const idToken:CognitoIdToken = session.getIdToken()
        // console.log(`ID Token: ${JSON.stringify(idToken.getJwtToken())}`);
        
        const url = `${environment.apiGateway}/players/${playerGuid}/profile`;
        // console.log(`get profile: ${url}`);
        const headers = new HttpHeaders({'Authorization':idToken.getJwtToken()});
        this.http.get<any>(url,{'headers':headers}).pipe(tap(profile=>{this._profile=profile;})).subscribe(
          (profile)=>{
            // console.log(`RESPONSE: ${JSON.stringify(profile)}`);            
            profile$.next(profile);
          }
        )
      }
    });
    return profile$;
  }
  saveProfile(playerGuid:string,profile:IProfileModel){
    this._profile = profile;
    this.getSession().then((session) => {
      if(session && session.isValid()) { 
        const idToken:CognitoIdToken = session.getIdToken()        
        const url = `${environment.apiGateway}/players/${playerGuid}/profile`;
        const headers = new HttpHeaders({'Authorization':idToken.getJwtToken()});

        // console.log(`SAVE PROFILE:
        // url:${url}
        // profile:${JSON.stringify(profile)}
        // playerGuid:${playerGuid}`);
        
        this.http.put<any>(url,profile,{'headers':headers}).subscribe((res)=>{
          // console.log(`RESPONSE: ${JSON.stringify(res)}`);
          null; //if we don't subscribe the http call is not made
        });
      }
    });
  }
  getDefaultProfile$():Observable<IProfileModel>{
      this._profile=DEFAULT_PROFILE;
      // this._profile.showStatistics=false;
      return of(this._profile);
  }
  
  getLocations$():Observable<Location[]>{
      const url = `http://worldtimeapi.org/api/timezone`;
      console.log(`getLocations$: ${url}`);
      return this.http.get<string[]>(url).pipe(
         map((locations)=>{
             console.log(`Locations: ${JSON.stringify(locations)}`);
              const locs:Location[]=[];
              locations.forEach(l=>{
                  locs.push(new Location(l));
              });          
              return locs;
          })
      );
  }
  getTimeZone$(loc:Location):Observable<TimeZone>{
      const url = `http://worldtimeapi.org/api/timezone/${loc.area()}/${loc.location()}/${loc.region()}`;
      console.log(`getTimeZones$: ${url}`);
      return this.http.get<TimeZone>(url).pipe(
          tap((tz)=>{
             console.log(`getTimeZone$:${JSON.stringify(tz)}`);     
          })
      );
  }
}
