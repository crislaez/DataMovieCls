import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMovie from './movie.reducer';

export const movieKey = 'movie';

export interface State {
  [movieKey]: fromMovie.State
}

export const reducer = fromMovie.reducer;

export const getMovieState = createFeatureSelector<State, fromMovie.State>(movieKey);


export const getMenu = createSelector(
  getMovieState,
  fromMovie.getMenu
);


export const getMovies = createSelector(
  getMovieState,
  fromMovie.getMovies
);

export const getMoviesGenre = createSelector(
  getMovieState,
  fromMovie.getMoviesGenre
);

export const getPending = createSelector(
  getMovieState,
  fromMovie.getPending
);

export const getPage = createSelector(
  getMovieState,
  fromMovie.getPage
);

export const getTotalPages = createSelector(
  getMovieState,
  fromMovie.getTotalPages
);

export const getTotalResult = createSelector(
  getMovieState,
  fromMovie.getTotalResult
);


export const getMenuGenre = (genreId:string) => createSelector(
  getMenu,
  (menuGenre) => {
    return menuGenre.find(genre => genre?.id === Number(genreId)) || {}
  }
);

