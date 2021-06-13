import { Menu } from '@clmovies/shareds/movie';
import { createAction, props, union} from '@ngrx/store';
import { Tv } from '../models';

export const loadMenuTv = createAction('[Tv] Load menu tv');
export const saveMenuTv = createAction('[Tv] Save menu tv', props<{menu: Menu[]}>());

export const loadTvs = createAction('[Tv] Load tvs', props<{typeTv?: string, page?:string}>());
export const saveTvs = createAction('[Tv] Save tvs', props<{tvs:Tv[], page:number, total_pages:number, total_results:number}>());

export const loadTvsGenre = createAction('[Tv] Load Tvs genre', props<{page?:string, idGenre: string}>());
export const saveTvsGenre = createAction('[Tv] Save Tvs genre', props<{tvs:Tv[], page:number, total_pages:number, total_results:number}>());

export const deleteTvsGenre = createAction('[Tv] Delete Tvs genre');

export const deleteTvs = createAction('[Tv] Delete tvs');


const all = union({
  loadMenuTv,
  saveMenuTv,
  loadTvs,
  saveTvs,
  deleteTvs,
  loadTvsGenre,
  saveTvsGenre,
  deleteTvsGenre
})

export type TvActionsUnion = typeof all;
