import { EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { createAction, props } from '@ngrx/store';
import { Movie, Tv } from '@clmovies/shareds/utils/models';

export const loadGenre = createAction(
  '[Genre] Load Genre',
  props<{page:string, idGenre: string, genre?: string}>()
);


export const saveGenre = createAction(
  '[Genre] Save Genre',
  props<{genres:any[], page:number, total_pages:number, total_results:number, status: EntityStatus, error:undefined }>()
);


export const deleteGenre = createAction(
  '[Genre] Delete Genre'
);
