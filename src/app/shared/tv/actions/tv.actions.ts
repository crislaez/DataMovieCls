
import { Menu, Tv } from '@clmovies/shareds/utils/models';
import { EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { createAction, props } from '@ngrx/store';


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


export const loadTvSerie = createAction(
  '[Tv] Load tv serie',
  props<{idSerie?: string, page?:string}>()
);

export const saveTvsSerie = createAction(
  '[Tv] Save tv serie',
  props<{serie:Tv, status: EntityStatus, error:unknown }>()
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
