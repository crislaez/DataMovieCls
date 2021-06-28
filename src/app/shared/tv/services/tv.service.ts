import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu } from '@clmovies/shareds/movie';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CoreConfigService } from '../../../core/services/core-config.service';
import { Tv } from '../models';


@Injectable({
  providedIn: 'root'
})
export class TvService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  apiKey: string = this._coreConfig.getApiKey();


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getMenuTv(): Observable<Menu[]>{
    return this.http.get<Menu[]>(`${this.baseURL}genre/tv/list?api_key=${this.apiKey}`).pipe(
      map( ({genres}: any) => (genres || [])),
      catchError((error) => {
        return throwError(error)
      })
    )
  };

  getTvsPopular(typeMovie:string = 'popular', page:string = '1'): Observable<any>{
    return this.http.get<any>(`${this.baseURL}tv/${typeMovie}?api_key=${this.apiKey}&page=${page}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({tvs: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(error)
      })
    )
  };

  getTv(idTv: string): Observable<Tv>{
    if(!idTv) return null
    return this.http.get<Tv>(`${this.baseURL}tv/${idTv}?api_key=${this.apiKey}`).pipe(
      map( (data) => (data || {})),
      catchError((error) => {
        return throwError(error)
      })
    )
  };

  getTvearch(searchName: string): Observable<any>{
    return this.http.get<any>(`${this.baseURL}search/tv?api_key=${this.apiKey}&query=${searchName}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({tvs: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(error)
      })
    )
  };

  getTvsByIdGenre(page:string = '1', genre:string = '12'): Observable<any>{
    // https://api.themoviedb.org/3/genre/28/movies?api_key=57e601c11dedd919bcbf7576f76caa11&page=1
    // https://api.themoviedb.org/3/genre/10759/tv?api_key=57e601c11dedd919bcbf7576f76caa11&page=1

    // https://api.themoviedb.org/3/genre/16/movies?api_key=57e601c11dedd919bcbf7576f76caa11&page=1
    // https://api.themoviedb.org/3/genre/9648/tv?api_key=57e601c11dedd919bcbf7576f76caa11&page=1
    return this.http.get<any>(`${this.baseURL}genre/${genre}/tv?api_key=${this.apiKey}&page=${page}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({tvs: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(error)
      })
    )
  };


}
