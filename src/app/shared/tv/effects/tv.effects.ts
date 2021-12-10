import { Injectable } from '@angular/core';
import { NotificationActions } from '@clmovies/shareds/notification';
import { EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as TvActions from '../actions/tv.actions';
import { TvService } from '../services/tv.service';

@Injectable()
export class TvEffects {

  loadMenuTv$ = createEffect( () =>
    this.actions$.pipe(
      ofType(TvActions.loadMenuTv),
      switchMap( () =>
        this._tv.getMenuTv().pipe(
          map( (menu) => TvActions.saveMenuTv({ menu: menu || [], status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            TvActions.saveMenuTv({ menu: [], status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_TV_MENU'})
          ))
        )
      )
    )
  );

  loadTvs$ = createEffect( () =>
    this.actions$.pipe(
      ofType(TvActions.loadTvs),
      switchMap( ({typeTv, page}) =>
        this._tv.getTvsPopular(typeTv, page).pipe(
          map( ({tvs, page, total_pages, total_results}) => TvActions.saveTvs({ tvs, page, total_pages, total_results, status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            TvActions.saveTvs({ tvs: [], page: 1, total_pages: 0 , total_results:0, status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_TVS'})
          ))
        )
      )
    )
  );

  loadTvSerie$ = createEffect( () =>
    this.actions$.pipe(
      ofType(TvActions.loadTvSerie),
      switchMap( ({ idSerie }) =>
        this._tv.getTvSerie(idSerie).pipe(
          map( (serie) => TvActions.saveTvsSerie({ serie, status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            TvActions.saveTvsSerie({ serie: {}, status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_TV'})
          ))
        )
      )
    )
  );


  loadTvInit$ = createEffect(() =>
    of(TvActions.loadMenuTv())
  );



  constructor(
    private actions$: Actions,
    private _tv: TvService
  ){}


}
