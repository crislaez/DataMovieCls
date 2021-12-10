import { Injectable } from '@angular/core';
import { NotificationActions } from '@clmovies/shareds/notification';
import { EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as SearchActions from '../actions/search.actions';
import { SearchService } from '../services/search.service';

@Injectable()
export class SearchEffects {


  loadSearch$ = createEffect( () =>
    this.actions$.pipe(
      ofType(SearchActions.loadSearch),
      switchMap( ({searchName, searchType, page}) =>
        this._search.getSearch(searchName, searchType, page).pipe(
          map(({searchs, page, total_pages, total_results}) => SearchActions.saveSearch({ searchs, page, total_pages, total_results, searchType, status: EntityStatus.Loaded, error: undefined })),
          catchError( (error) => of(
            SearchActions.saveSearch({ searchs: [], page: 1, total_pages: 0, total_results: 0, searchType, status: EntityStatus.Error, error }),
            NotificationActions.notificationFailure({message: 'ERRORS.ERROR_LOAD_INFO'})
          ))
        )
      )
    )
  );



  constructor(
    private actions$: Actions,
    private _search: SearchService
  ){}


}
