

import { Injectable } from '@angular/core';
import { TYPE_MOVIES } from '@clmovies/shareds/utils/constants';
import { MovieActions } from '@clmovies/shareds/movie';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as MoviePageActions from '../actions/movie-page.actions';


@Injectable()
export class MoviePageEffects implements OnInitEffects {

  loadAllTypeMovies$ = createEffect( () =>
    this.actions$.pipe(
      ofType(MoviePageActions.loadAllTypeMovies),
      switchMap( ({ typesMovies }) =>
        of(...(typesMovies || [])?.map((typeMovie) => {
            return MovieActions.loadMovies({typeMovie, page:1, filter:{}})
          })
        )
      )
    )
  );


  ngrxOnInitEffects(): Action {
    return MoviePageActions.loadAllTypeMovies({typesMovies: TYPE_MOVIES})
  };



  constructor(
    private actions$: Actions,
  ){}


}
