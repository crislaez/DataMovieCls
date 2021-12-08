import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTv from '../reducers/tv.reducer';

export const selectTvState = createFeatureSelector<fromTv.State>(
  fromTv.tvFeatureKey
);

export const getMenu = createSelector(
  selectTvState,
  (state) => state?.menu
);

export const getTvs = createSelector(
  selectTvState,
  (state) => state?.tvs
);

export const getTvsGenre = createSelector(
  selectTvState,
  (state) => state?.tvsGenre
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

export const getMenuGenre = (genreId:string) => createSelector(
  getMenu,
  (menuGenre) => {
    return (menuGenre || [])?.find(genre => genre?.id === Number(genreId)) || {}
  }
);

