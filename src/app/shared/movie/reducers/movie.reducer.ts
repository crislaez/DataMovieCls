import { createReducer, on  } from '@ngrx/store';
import * as MovieActions from '../actions/movie.actions';
import { Menu, Movie } from '../models';
import { EntityStatus } from '@clmovies/shareds/shared/utils/utils';

export const movieFeatureKey = 'movie';

export interface State{
  menu?: Menu[];
  movies?: Movie[];
  moviesGenre?: Movie[];
  status: EntityStatus;
  page?: number;
  total_pages?: number;
  total_results?: number;
  error?: unknown
}

const initialState: State = {
  menu: [],
  movies: [],
  moviesGenre: [],
  status: EntityStatus.Initial,
  page: 0,
  total_pages: 0,
  total_results: 0,
  error: undefined
}

export const reducer = createReducer(
  initialState,
  on(MovieActions.loadMenu, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(MovieActions.saveMenu, (state, { menu, status, error }) => ({...state, menu, status, error })),

  on(MovieActions.loadMovies, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(MovieActions.saveMovies, (state, { movies, page, total_pages, total_results, status, error }) => ({...state, movies:[...state?.movies,...movies], page, total_pages, total_results, error, status})),

  on(MovieActions.loadMoviesGenre, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(MovieActions.saveMoviesGenre, (state, { movies, page, total_pages, total_results, status, error }) => ({...state, moviesGenre:[...state?.moviesGenre,...movies], page, total_pages, total_results, error, status })),

  on(MovieActions.deleteMovies, (state) => ({...state, movies:[], page:1, total_pages:0, total_results:0 })),

  on(MovieActions.deleteMovieGenre, (state) => ({...state, moviesGenre:[], page:1 }))
);
