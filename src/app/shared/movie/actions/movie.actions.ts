import { EntityStatus } from '@clmovies/shareds/shared/utils/utils';
import { createAction, props } from '@ngrx/store';
import { Menu, Movie } from '../models';


export const loadMenu = createAction(
  '[Movie] Load menu'
);

export const saveMenu = createAction(
  '[Movie] Save menu',
  props<{menu: Menu[], status: EntityStatus, error:unknown}>()
);


export const loadMovies = createAction(
  '[Movie] Load movies',
  props<{typeMovie?: string, page?:string}>()
);

export const saveMovies = createAction(
  '[Movie] Save movies',
  props<{movies:Movie[], page:number, total_pages:number, total_results:number, status: EntityStatus, error:unknown }>()
);


export const loadMovie = createAction(
  '[Movie] Load movie',
  props<{idMovie: string}>()
);

export const saveMovie = createAction(
  '[Movie] Save movie',
  props<{movie:Movie, status: EntityStatus, error:unknown }>()
);


export const loadMoviesGenre = createAction(
  '[Movie] Load movies genre',
  props<{page?:string, idGenre: string}>()
);

export const saveMoviesGenre = createAction(
  '[Movie] Save movies genre',
  props<{movies:Movie[], page:number, total_pages:number, total_results:number, status: EntityStatus, error:unknown}>()
);


export const deleteMovies = createAction(
  '[Movie] Delete movies'
);

export const deleteMovieGenre = createAction(
  '[Movie] Delete movies genre'
);
