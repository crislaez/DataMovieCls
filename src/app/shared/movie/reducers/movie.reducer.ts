import { createReducer, on  } from '@ngrx/store';
import { MovieActions } from '../actions';
import { Menu, Movie } from '../models';

// interface Status {
//   pending?: boolean;
//   error?: string;
// }

export interface State{
  menu?: Menu[];
  // movie?: Movie;
  movies?: Movie[];
  moviesGenre?: Movie[];
  pending?: boolean;
  page?: number;
  total_pages?: number;
  total_results?: number;
}

const initialState: State = {
  menu: [],
  movies: [],
  moviesGenre: [],
  pending: false,
  page: 0,
  total_pages: 0,
  total_results: 0,
}

const MovieReducer = createReducer(
  initialState,
  on(MovieActions.loadMenu, (state) => ({...state, pending: true})),
  on(MovieActions.saveMenu, (state, { menu }) => ({...state, menu, pending: false })),

  on(MovieActions.loadMovies, (state) => ({...state, pending: true})),
  on(MovieActions.saveMovies, (state, { movies, page, total_pages, total_results }) => ({...state, movies:[...state?.movies,...movies], page, total_pages, total_results,  pending: false })),

  on(MovieActions.deleteMovies, (state) => ({...state, movies:[], page:1, total_pages:0, total_results:0,  pending: false })),

  on(MovieActions.loadMoviesGenre, (state) => ({...state, pending: true})),
  on(MovieActions.saveMoviesGenre, (state, { movies, page, total_pages, total_results }) => ({...state, moviesGenre:[...state?.moviesGenre,...movies], page, total_pages, total_results,  pending: false })),

  on(MovieActions.deleteMovieGenre, (state) => ({...state, moviesGenre:[]}))
);

export function reducer(state: State | undefined, action: MovieActions.MovieActionsUnion){
  return MovieReducer(state, action);
}


export const getMenu = (state: State) => state?.menu;
export const getMovies = (state: State) => state?.movies;
export const getMoviesGenre = (state: State) => state?.moviesGenre;
export const getPending = (state: State) => state?.pending;
export const getPage = (state: State) => state?.page;
export const getTotalPages = (state: State) => state?.total_pages;
export const getTotalResult = (state: State) => state?.total_results;

