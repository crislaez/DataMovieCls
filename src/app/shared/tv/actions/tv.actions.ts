import { Menu } from '@clmovies/shareds/movie';
import { EntityStatus } from '@clmovies/shareds/shared/utils/utils';
import { createAction, props } from '@ngrx/store';
import { Tv } from '../models';


export const loadMenuTv = createAction(
  '[Tv] Load menu tv'
);

export const saveMenuTv = createAction(
  '[Tv] Save menu tv',
  props<{menu: Menu[], status: EntityStatus, error:undefined}>()
);


export const loadTvs = createAction(
  '[Tv] Load tvs',
  props<{typeTv?: string, page?:string}>()
);

export const saveTvs = createAction(
  '[Tv] Save tvs',
  props<{tvs:Tv[], page:number, total_pages:number, total_results:number, status: EntityStatus, error:undefined }>()
);


export const loadTvsGenre = createAction(
  '[Tv] Load Tvs genre',
  props<{page?:string, idGenre: string}>()
);

export const saveTvsGenre = createAction(
  '[Tv] Save Tvs genre',
  props<{tvs:Tv[], page:number, total_pages:number, total_results:number, status: EntityStatus, error:undefined }>()
);


export const deleteTvsGenre = createAction(
  '[Tv] Delete Tvs genre'
);

export const deleteTvs = createAction(
  '[Tv] Delete tvs'
);
