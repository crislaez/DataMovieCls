import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMovie from '../reducers/movie.reducer';

export const selectMovieState = createFeatureSelector<fromMovie.State>(
  fromMovie.movieFeatureKey
);

export const getMenu = createSelector(
  selectMovieState,
  (state) => state?.menu
);

export const getMovies = createSelector(
  selectMovieState,
  (state) => state?.movies
);

export const getMoviesGenre = createSelector(
  selectMovieState,
  (state) => state?.moviesGenre
);

export const getStatus = createSelector(
  selectMovieState,
  (state) => state?.status
);

export const getPage = createSelector(
  selectMovieState,
  (state) => state?.page
);

export const getTotalPages = createSelector(
  selectMovieState,
  (state) => state?.total_pages
);

export const getTotalResult = createSelector(
  selectMovieState,
  (state) => state?.total_results
);

export const getMenuGenre = (genreId:string) => createSelector(
  getMenu,
  (menuGenre) => {
    return (menuGenre || [])?.find(genre => genre?.id === Number(genreId)) || {}
  }
);
