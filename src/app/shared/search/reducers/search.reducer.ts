import { EntityStatus } from '@clmovies/shareds/utils/utils/functions';
import { createReducer, on } from '@ngrx/store';
import * as SearchActions from '../actions/search.actions';
import { Menu, Movie } from '@clmovies/shareds/utils/models';

export const searchFeatureKey = 'search';


export interface State{
  searchs?: any[];
  status: EntityStatus;
  page?: number;
  total_pages?: number;
  total_results?: number;
  searchType?: string;
  error?: unknown
}

const initialState: State = {
  searchs: [],
  status: EntityStatus.Initial,
  page: 1,
  total_pages: 0,
  total_results: 0,
  searchType: '',
  error: undefined
}

export const reducer = createReducer(
  initialState,
  on(SearchActions.loadSearch, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(SearchActions.saveSearch, (state, { searchs, page, total_pages, total_results, searchType, status, error }) => {
    return {
      ...state,
      searchs:[
        ...( page !== 1 ? state?.searchs : [] ),
        ...searchs
      ],
      page,
      total_pages,
      total_results,
      searchType,
      error,
      status
    }
  }),

  on(SearchActions.deleteSearch, (state) => ({...state, searchs:[], page:1, total_pages: 0, total_results: 0, status: EntityStatus.Loaded, error: undefined }))
);
