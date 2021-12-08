import { Injectable } from '@angular/core';
import { NotificationActions } from '@clmovies/shareds/notification';
import { EntityStatus } from '@clmovies/shareds/shared/utils/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as MovieActions from '../actions/movie.actions';
import { MovieService } from '../services/movie.service';

@Injectable()
export class MovieEffects {

  loadMenu$ = createEffect( () =>
    this.actions$.pipe(
      ofType(MovieActions.loadMenu),
      switchMap( () =>
        this._movie.getMenu().pipe(
          map(menu => MovieActions.saveMenu({ menu, status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            MovieActions.saveMenu({ menu: [], status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_MOVIE_MENU'})
          ))
        )
      )
    )
  );

  loadMovies$ = createEffect( () =>
    this.actions$.pipe(
      ofType(MovieActions.loadMovies),
      switchMap( ({typeMovie, page}) =>
        this._movie.getMoviesPopular(typeMovie, page).pipe(
          map( ({movies, page, total_pages, total_results}) => MovieActions.saveMovies({ movies, page, total_pages, total_results, status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            MovieActions.saveMovies({ movies: [], page: 1, total_pages: 0 , total_results:0, status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_MOVIES'})
          ))
        )
      )
    )
  );

  loadMoviesGenre$ = createEffect( () =>
    this.actions$.pipe(
      ofType(MovieActions.loadMoviesGenre),
      switchMap( ({page, idGenre}) =>
        this._movie.getMoviesByIdGenre(page, idGenre).pipe(
          map( ({movies, page, total_pages, total_results}) => MovieActions.saveMoviesGenre({ movies, page, total_pages, total_results, status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            MovieActions.saveMoviesGenre({ movies: [], page: 1, total_pages: 0 , total_results:0, status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_MOVIE_GENRE'})
          ))
        )
      )
    )
  );

  loadMoviesMenu$ = createEffect(() =>
    of(MovieActions.loadMenu())
  );



  constructor(
    private actions$: Actions,
    private _movie: MovieService
  ){}


}
