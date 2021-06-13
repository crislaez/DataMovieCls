import { Menu } from '@clmovies/shareds/movie';
import { createReducer, on  } from '@ngrx/store';
import { TvActions } from '../actions';
import { Tv } from '../models';

// interface Status {
//   pending?: boolean;
//   error?: string;
// }

export interface State{
  tvs?: Tv[];
  tvsGenre?: Tv[];
  menu: Menu[],
  pending?: boolean;
  page?: number;
  total_pages?: number;
  total_results?: number;
}

const initialState: State = {
  tvs: [],
  tvsGenre: [],
  menu: [],
  pending: false,
  page: 0,
  total_pages: 0,
  total_results: 0,
}

const MovieReducer = createReducer(
  initialState,
  on(TvActions.loadMenuTv, (state) => ({...state, pending: true})),
  on(TvActions.saveMenuTv, (state, { menu }) => ({...state, menu, pending: false })),

  on(TvActions.loadTvs, (state) => ({...state, pending: true})),
  on(TvActions.saveTvs, (state, { tvs, page, total_pages, total_results }) => ({...state, tvs:[...state?.tvs,...tvs], page, total_pages, total_results,  pending: false })),

  on(TvActions.deleteTvs, (state) => ({...state, tvs:[], page:1, total_pages:0, total_results:0,  pending: false })),

  on(TvActions.loadTvsGenre, (state) => ({...state, pending: true})),
  on(TvActions.saveTvsGenre, (state, { tvs, page, total_pages, total_results }) => ({...state, tvsGenre:[...state?.tvsGenre,...tvs], page, total_pages, total_results,  pending: false })),

  on(TvActions.deleteTvsGenre, (state) => ({...state, tvsGenre:[]}))
);

export function reducer(state: State | undefined, action: TvActions.TvActionsUnion){
  return MovieReducer(state, action);
}


export const getMenu = (state: State) => state?.menu;
export const getTvs = (state: State) => state?.tvs;
export const getTvsGenre = (state: State) => state?.tvsGenre;
export const getPending = (state: State) => state?.pending;
export const getPage = (state: State) => state?.page;
export const getTotalPages = (state: State) => state?.total_pages;
export const getTotalResult = (state: State) => state?.total_results;

