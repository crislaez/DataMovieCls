
import { Menu, Tv } from '@clmovies/shareds/utils/models';
import { EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { createReducer, on } from '@ngrx/store';
import * as TvActions from '../actions/tv.actions';

export const tvFeatureKey = 'tv';

export interface State{
  tvs?: Tv[];
  tvsGenre?: Tv[];
  menu: Menu[],
  serie?: Tv;
  status: EntityStatus;
  page?: number;
  total_pages?: number;
  total_results?: number;
  error?: unknown;
}

const initialState: State = {
  tvs: [],
  tvsGenre: [],
  menu: [],
  serie: null,
  status: EntityStatus.Initial,
  page: 1,
  total_pages: 0,
  total_results: 0,
  error: undefined
}

export const reducer = createReducer(
  initialState,
  on(TvActions.loadMenuTv, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(TvActions.saveMenuTv, (state, { menu, status, error }) => ({...state, menu, status, error })),

  on(TvActions.loadTvs, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(TvActions.saveTvs, (state, { tvs, page, total_pages, total_results, status, error }) => {
    return {
      ...state,
      tvs:[
        ...( page !== 1 ? state?.tvs : [] ),
        ...tvs
      ],
      page,
      total_pages,
      total_results,
      status,
      error
    }
  }),

  on(TvActions.loadTvSerie, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(TvActions.saveTvsSerie, (state, { serie, status, error }) => ({...state, serie, status, error })),

  on(TvActions.loadTvsGenre, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(TvActions.saveTvsGenre, (state, { tvs, page, total_pages, total_results, status, error }) => ({...state, tvsGenre:[...state?.tvsGenre,...tvs], page, total_pages, total_results, status, error })),

  on(TvActions.deleteTvs, (state) => ({...state, tvs:[], page:1, total_pages:0, total_results:0 })),

  on(TvActions.deleteTvsGenre, (state) => ({...state, tvsGenre:[], page:1}))
);
