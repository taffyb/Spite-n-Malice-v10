import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, of} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import * as common from './service.common';
import {IProfileModel,DEFAULT_PROFILE,IPlayerModel} from 's-n-m-lib';
import {Location, TimeZone} from '../classes/timezones'
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile:IProfileModel;
  playerGuid:string;

  constructor(private http:HttpClient) { }
  
  getActiveProfile():IProfileModel{
    console.log(`getActiveProfile:`);
      return this._profile;
  }
  getProfile$(playerGuid:string):Observable<IProfileModel>{
      
    const url = `${environment.apiGateway}/players/${playerGuid}/profile`;
    console.log(`get profile: ${url}`);
    return this.http.get<IProfileModel>(url).pipe(tap(profile=>{this._profile=profile;}));
  }
  saveProfile(playerGuid:string,profile:IProfileModel){
      this._profile.showStatistics=profile.showStatistics;
  }
  getDefaultProfile$():Observable<IProfileModel>{
      this._profile=DEFAULT_PROFILE;
      this._profile.showStatistics=false;
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
