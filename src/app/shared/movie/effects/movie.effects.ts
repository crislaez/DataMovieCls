import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MovieActions } from '../actions';
import { MovieService } from '../services/movie.service';


@Injectable()
export class MovieEffects {

  loadMenu$ = createEffect( () =>
    this.actions$.pipe(
      ofType(MovieActions.loadMenu),
      switchMap( () =>
        this._movie.getMenu().pipe(
          map( (menu) => MovieActions.saveMenu({ menu: menu || []})),
          catchError( () => [MovieActions.saveMenu({ menu: [] })]),
        )
      )
    )
  );

  loadMovies$ = createEffect( () =>
    this.actions$.pipe(
      ofType(MovieActions.loadMovies),
      switchMap( ({typeMovie, page}) =>
        this._movie.getMoviesPopular(typeMovie, page).pipe(
          map( ({movies, page, total_pages, total_results}) => MovieActions.saveMovies({ movies: movies || [], page: page || 1, total_pages: total_pages || 0 , total_results: total_results || 0})),
          catchError( () => [MovieActions.saveMovies({ movies: [], page: 1, total_pages: 0 , total_results:0 })]),
        )
      )
    )
  );

  loadMoviesGenre$ = createEffect( () =>
    this.actions$.pipe(
      ofType(MovieActions.loadMoviesGenre),
      switchMap( ({page, idGenre}) =>
        this._movie.getMoviesByIdGenre(page, idGenre).pipe(
          map( ({movies, page, total_pages, total_results}) => MovieActions.saveMoviesGenre({ movies: movies || [], page: page || 1, total_pages: total_pages || 0 , total_results: total_results || 0})),
          catchError( () => [MovieActions.saveMoviesGenre({ movies: [], page: 1, total_pages: 0 , total_results:0 })]),
        )
      )
    )
  );

  loadMoviesMenu$ = createEffect(() =>
    of(MovieActions.loadMenu())
  );

  constructor(
    private actions$: Actions,
    private _movie: MovieService,
    private location: Location
  ){}
}
