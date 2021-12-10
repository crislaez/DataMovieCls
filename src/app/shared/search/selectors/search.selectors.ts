import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from '../reducers/search.reducer';

export const selectSearchState = createFeatureSelector<fromSearch.State>(
  fromSearch.searchFeatureKey
);

export const getSearchs = createSelector(
  selectSearchState,
  (state) => state?.searchs
);

export const getStatus = createSelector(
  selectSearchState,
  (state) => state?.status
);

export const getPage = createSelector(
  selectSearchState,
  (state) => state?.page
);

export const getTotalPages = createSelector(
  selectSearchState,
  (state) => state?.total_pages
);

export const getTotalResult = createSelector(
  selectSearchState,
  (state) => state?.total_results
);

