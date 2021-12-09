import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGenre from '../reducers/genre.reducer';

export const selectTvState = createFeatureSelector<fromGenre.State>(
  fromGenre.genreFeatureKey
);


export const getGenres = createSelector(
  selectTvState,
  (state) => state?.genres
);

export const getStatus = createSelector(
  selectTvState,
  (state) => state?.status
);

export const getPage = createSelector(
  selectTvState,
  (state) => state?.page
);

export const getTotalPages = createSelector(
  selectTvState,
  (state) => state?.total_pages
);

export const getTotalResult = createSelector(
  selectTvState,
  (state) => state?.total_results
);
