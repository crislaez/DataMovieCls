import { Menu, Movie } from '@clmovies/shareds/utils/models';
import { EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { createAction, props } from '@ngrx/store';


export const loadSearch = createAction(
  '[Search] Load search',
  props<{searchName?: string, searchType?: string, page?:string}>()
);

export const saveSearch = createAction(
  '[Movie] Save search',
  props<{searchs:Movie[], page:number, total_pages:number, total_results:number, searchType: string, status: EntityStatus, error:unknown }>()
);


export const deleteSearch = createAction(
  '[Search] Delete search'
);

