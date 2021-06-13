import { createAction, props, union} from '@ngrx/store';
import { Menu, Movie } from '../models';

export const loadMenu = createAction('[Movie] Load menu');
export const saveMenu = createAction('[Movie] Save menu', props<{menu: Menu[]}>());

export const loadMovies = createAction('[Movie] Load movies', props<{typeMovie?: string, page?:string}>());
export const saveMovies = createAction('[Movie] Save movies', props<{movies:Movie[], page:number, total_pages:number, total_results:number}>());

export const deleteMovies = createAction('[Movie] Delete movies');

export const loadMoviesGenre = createAction('[Movie] Load movies genre', props<{page?:string, idGenre: string}>());
export const saveMoviesGenre = createAction('[Movie] Save movies genre', props<{movies:Movie[], page:number, total_pages:number, total_results:number}>());

export const deleteMovieGenre = createAction('[Movie] Delete movies genre');


const all = union({
  loadMenu,
  saveMenu,
  loadMovies,
  saveMovies,
  deleteMovies,
  loadMoviesGenre,
  saveMoviesGenre,
  deleteMovieGenre
})

export type MovieActionsUnion = typeof all;
