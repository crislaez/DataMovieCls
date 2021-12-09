import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CoreConfigService } from '../../../core/services/core-config.service';
import { Menu, Movie } from '../models';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  baseURL: string = `${this._coreConfig.getEndpoint()}`;
  apiKey: string = this._coreConfig.getApiKey();


  constructor(private http: HttpClient, private _coreConfig: CoreConfigService) { }


  getMenu(): Observable<Menu[]>{
    return this.http.get<Menu[]>(`${this.baseURL}genre/movie/list?api_key=${this.apiKey}`).pipe(
      map( ({genres}: any) => (genres || [])),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };

  getMovie(idMovie: string): Observable<Movie>{
    if(!idMovie) return null
    return this.http.get<Movie>(`${this.baseURL}movie/${idMovie}?api_key=${this.apiKey}`).pipe(
      map( (data) => (data || {})),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };

  getMoviesPopular(typeMovie:string = 'popular', page:string = '1'): Observable<any>{
    return this.http.get<any>(`${this.baseURL}movie/${typeMovie}?api_key=${this.apiKey}&page=${page}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({movies: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };

  // getMoviesByIdGenre(page:string = '1', genre:string = '12'): Observable<any>{
  //   return this.http.get<any>(`${this.baseURL}genre/${genre}/movies?api_key=${this.apiKey}&page=${page}`).pipe(
  //     map( ({page, results, total_pages, total_results }) => ({movies: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
  //     catchError((error) => {
  //       return throwError(() => error)
  //     })
  //   )
  // };

  getMoviesSearch(searchName: string): Observable<any>{
    return this.http.get<any>(`${this.baseURL}search/movie?api_key=${this.apiKey}&query=${searchName}`).pipe(
      map( ({page, results, total_pages, total_results }) => ({movies: results || [], page:page || 1, total_pages:total_pages || 0 , total_results:total_results || 0})),
      catchError((error) => {
        return throwError(() => error)
      })
    )
  };




}
