import { EntityStatus } from '@clmovies/shareds/shared/utils/utils';
import { createReducer, on } from '@ngrx/store';
import * as GenreActions from '../actions/genre.actions';
import { Tv } from '@clmovies/shareds/tv';
import { Movie } from '@clmovies/shareds/movie';

export const genreFeatureKey = 'genre';

export interface State{
  genres?: any[];
  status: EntityStatus;
  page?: number;
  total_pages?: number;
  total_results?: number;
  error?: unknown;
}

const initialState: State = {
  genres: [],
  status: EntityStatus.Initial,
  page: 0,
  total_pages: 0,
  total_results: 0,
  error: undefined
}

export const reducer = createReducer(
  initialState,
  on(GenreActions.loadGenre, (state) => ({...state, status: EntityStatus.Pending, error: undefined })),
  on(GenreActions.saveGenre, (state, { genres, page, total_pages, total_results, status, error }) => {
    return {
      ...state,
      genres:[
        ...( page !== 1 ? state?.genres : [] ),
        ...genres
      ],
      page,
      total_pages,
      total_results,
      status,
      error
    }
  }),


  on(GenreActions.deleteGenre, (state) => ({...state, tvsGenre:[], page:1}))
);
