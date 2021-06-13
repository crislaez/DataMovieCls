import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTv from './tv.reducer';

export const tvKey = 'tv';

export interface State {
  [tvKey]: fromTv.State
}

export const reducer = fromTv.reducer;

export const getTvState = createFeatureSelector<State, fromTv.State>(tvKey);


export const getMenu = createSelector(
  getTvState,
  fromTv.getMenu
);

export const getTvs = createSelector(
  getTvState,
  fromTv.getTvs
);

export const getTvsGenre = createSelector(
  getTvState,
  fromTv.getTvsGenre
);

export const getPending = createSelector(
  getTvState,
  fromTv.getPending
);

export const getPage = createSelector(
  getTvState,
  fromTv.getPage
);

export const getTotalPages = createSelector(
  getTvState,
  fromTv.getTotalPages
);

export const getTotalResult = createSelector(
  getTvState,
  fromTv.getTotalResult
);


// export const getMenuGenre = (genreId:string) => createSelector(
//   getMenu,
//   (menuGenre) => {
//     return menuGenre.find(genre => genre?.id === Number(genreId)) || {}
//   }
// );

