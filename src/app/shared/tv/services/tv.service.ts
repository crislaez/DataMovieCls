import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu, Tv } from '@clmovies/shareds/utils/models';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CoreConfigService } from '../../../core/services/core-config.service';

@Injectable({
  providedIn: 'root'
})
export class TvService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  apiKey: string = this._coreConfig.getApiKey();
  perPage: string = this._coreConfig.getPerPage();


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getMenuTv(): Observable<Menu[]>{
    return this.http.get<Menu[]>(`${this.baseURL}genre/tv/list?api_key=${this.apiKey}`).pipe(
      map( ({genres}: any) => (genres || [])),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };

  getTvsPopular(typeMovie:string = 'popular', page:string = '1'): Observable<any>{
    return this.http.get<any>(`${this.baseURL}tv/${typeMovie}?api_key=${this.apiKey}&page=${page}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({tvs: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };

  getTvSerie(idTv: string): Observable<Tv>{
    if(!idTv) return of({})
    return this.http.get<Tv>(`${this.baseURL}tv/${idTv}?api_key=${this.apiKey}`).pipe(
      map( (data) => (data || {})),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };



}
