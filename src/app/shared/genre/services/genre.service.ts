import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@clmovies/core/services/core-config.service';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  apiKey: string = this._coreConfig.getApiKey();
  perPage: string = this._coreConfig.getPerPage();


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getGenreById(idGenre: string, page:string = '1', genre:string): Observable<any>{
    if(genre === 'movie'){
      return this.http.get<any>(`${this.baseURL}genre/${idGenre}/movies?api_key=${this.apiKey}&page=${page}`).pipe(
        map( ({page, results, total_pages, total_results }) => ({genres: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
        catchError((error) => {
          return throwError(() => error)
        })
      )
    }

    return this.http.get<any>(`${this.baseURL}discover/tv?api_key=${this.apiKey}&with_genres=${idGenre}&page=${page}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({genres: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };



}
