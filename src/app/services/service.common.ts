
import {HttpHeaders} from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';

export const endpoint='https://85b104by6f.execute-api.eu-west-2.amazonaws.com/sm_v2';
export const httpOptions:any = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
          })
        };
export const handleError=<T> (operation = 'operation', result?: T) =>{
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  