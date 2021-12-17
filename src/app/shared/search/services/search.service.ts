import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreConfigService } from '@clmovies/core/services/core-config.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  apiKey: string = this._coreConfig.getApiKey();
  perPage: string = this._coreConfig.getPerPage();


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getSearch(searchName: string, type: string, page: string): Observable<any> {

    if(type === "movie"){
      return this.http.get<any>(`${this.baseURL}search/movie?api_key=${this.apiKey}&query=${searchName}&page=${page}`).pipe(
        map( ({page, results, total_pages, total_results }) => ({searchs: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
        catchError((error) => {
          return throwError(() => error)
        })
      )
    }

    return this.http.get<any>(`${this.baseURL}search/tv?api_key=${this.apiKey}&query=${searchName}&page=${page}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({searchs: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(() => error)
      })
    )

  }



}
