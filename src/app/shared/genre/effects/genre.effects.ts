import { Injectable } from '@angular/core';
import { NotificationActions } from '@clmovies/shareds/notification';
import { EntityStatus } from '@clmovies/shareds/shared/utils/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as Genrections from '../actions/genre.actions';
import { GenreService } from '../services/genre.service';


@Injectable()
export class GenreEffects {

  loadGenre$ = createEffect( () =>
    this.actions$.pipe(
      ofType(Genrections.loadGenre),
      switchMap( ({idGenre, page, genre}) =>
        this._genre.getGenreById(idGenre, page, genre).pipe(
          map( ({genres, page, total_pages, total_results}) => Genrections.saveGenre({ genres, page, total_pages, total_results, status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            Genrections.saveGenre({ genres: [], page: 1, total_pages: 0 , total_results:0, status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_INFO'})
          ))
        )
      )
    )
  );



  constructor(
    private actions$: Actions,
    private _genre: GenreService
  ){}


}
