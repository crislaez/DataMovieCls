import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TvActions } from '../actions';
import { TvService } from '../services/tv.service';


@Injectable()
export class TvEffects {


  loadMenuTv$ = createEffect( () =>
    this.actions$.pipe(
      ofType(TvActions.loadMenuTv),
      switchMap( () =>
        this._tv.getMenuTv().pipe(
          map( (menu) => TvActions.saveMenuTv({ menu: menu || []})),
          catchError( () => [TvActions.saveMenuTv({menu: []})]),
        )
      )
    )
  );

  loadTvs$ = createEffect( () =>
    this.actions$.pipe(
      ofType(TvActions.loadTvs),
      switchMap( ({typeTv, page}) =>
        this._tv.getTvsPopular(typeTv, page).pipe(
          map( ({tvs, page, total_pages, total_results}) => TvActions.saveTvs({ tvs: tvs || [], page: page || 1, total_pages: total_pages || 0 , total_results: total_results || 0})),
          catchError( () => [TvActions.saveTvs({ tvs: [], page: 1, total_pages: 0 , total_results:0 })]),
        )
      )
    )
  );

  loadTvsGenre$ = createEffect( () =>
    this.actions$.pipe(
      ofType(TvActions.loadTvsGenre),
      switchMap( ({page, idGenre}) =>
        this._tv.getTvsByIdGenre(page, idGenre).pipe(
          map( ({tvs, page, total_pages, total_results}) => TvActions.saveTvsGenre({ tvs: tvs || [], page: page || 1, total_pages: total_pages || 0 , total_results: total_results || 0})),
          catchError( () => [TvActions.saveTvsGenre({ tvs: [], page: 1, total_pages: 0 , total_results:0 })]),
        )
      )
    )
  );


  loadTvInit$ = createEffect(() =>
    of(TvActions.loadTvs({page:'1', typeTv:'popular'}), TvActions.loadMenuTv())
  );

  constructor(
    private actions$: Actions,
    private _tv: TvService
  ){}
}
