import { Injectable } from '@angular/core';
import { TvActions } from '@clmovies/shareds/tv';
import { TYPE_TVS } from '@clmovies/shareds/utils/constants';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as TvPageActions from '../actions/tv-page.actions';


@Injectable()
export class TvPageEffects implements OnInitEffects {


  loadAllTypeTvs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TvPageActions.loadAllTypeTvs),
      switchMap(({typesTvs}) =>
        of(...(typesTvs || [])?.map(typeTv => {
            return TvActions.loadTvs({typeTv, page:1, filter:{} })
          })
        )
      )
    )
  );

  ngrxOnInitEffects(): Action {
    return TvPageActions.loadAllTypeTvs({typesTvs: TYPE_TVS})
  };



  constructor(
    private actions$: Actions,
  ){ }


}
